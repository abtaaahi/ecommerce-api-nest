
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
    ) { }

    async create(createProductDto: CreateProductDto): Promise<Product> {
        const product = this.productsRepository.create(createProductDto);
        return this.productsRepository.save(product);
    }

    async findAll(): Promise<Product[]> {
        return this.productsRepository.find();
    }

    async findOne(id: string): Promise<Product> {
        const product = await this.productsRepository.findOne({ where: { id } });
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }
    async updateStock(id: string, quantity: number) {
        const product = await this.findOne(id);
        product.stock = quantity;
        return this.productsRepository.save(product);
    }

    async decrementStock(id: string, quantity: number) {
        const product = await this.findOne(id);
        if (product.stock < quantity) {
            throw new BadRequestException(`Insufficient stock for product ${product.name}`);
        }
        product.stock -= quantity;
        await this.productsRepository.save(product);
    }
}
