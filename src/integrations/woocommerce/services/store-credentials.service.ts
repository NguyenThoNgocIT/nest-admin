import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateStoreDto, UpdateStoreDto } from '../dto/create-store.dto'
import { WooCommerceStoreEntity } from '../entities/woocommerce-store.entity'

@Injectable()
export class StoreCredentialsService {
  constructor(
    @InjectRepository(WooCommerceStoreEntity)
    private readonly storeRepository: Repository<WooCommerceStoreEntity>,
  ) {}

  async create(createStoreDto: CreateStoreDto): Promise<WooCommerceStoreEntity> {
    const store = this.storeRepository.create(createStoreDto)
    return this.storeRepository.save(store)
  }

  async update(id: number, updateStoreDto: UpdateStoreDto): Promise<WooCommerceStoreEntity> {
    const store = await this.storeRepository.findOne({ where: { id } })
    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`)
    }
    Object.assign(store, updateStoreDto)
    return this.storeRepository.save(store)
  }

  async delete(id: number): Promise<void> {
    await this.storeRepository.delete(id)
  }

  async getCredentials(storeId: number): Promise<WooCommerceStoreEntity> {
    return this.storeRepository.findOne({ where: { id: storeId } })
  }

  async getAllActiveStores(): Promise<WooCommerceStoreEntity[]> {
    return this.storeRepository.find({ where: { isActive: true } })
  }
}
