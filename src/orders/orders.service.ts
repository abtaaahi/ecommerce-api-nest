
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from '../users/entities/user.entity';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
        private productsService: ProductsService,
    ) { }

    async create(user: User, createOrderDto: CreateOrderDto): Promise<Order> {
        const items: any[] = [];
        let totalAmount = 0;

        for (const item of createOrderDto.items) {
            const product = await this.productsService.findOne(item.productId);
            if (!product) {
                throw new BadRequestException(`Product ${item.productId} not found`);
            }
            // Simple stock check can be added here
            totalAmount += Number(product.price) * item.quantity;
            items.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
            });
        }

        const order = this.ordersRepository.create({
            user,
            items,
            totalAmount,
            status: OrderStatus.PENDING,
        });

        return this.ordersRepository.save(order);
    }

    async findAll(user: User): Promise<Order[]> {
        return this.ordersRepository.find({
            where: { user: { id: user.id } },
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string): Promise<Order | null> {
        return this.ordersRepository.findOne({ where: { id }, relations: ['user'] });
    }

    async updateStatus(id: string, status: OrderStatus, paymentIntentId?: string) {
        await this.ordersRepository.update(id, {
            status,
            stripePaymentIntentId: paymentIntentId
        });
    }
}
