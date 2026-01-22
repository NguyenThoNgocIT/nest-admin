import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BatchSettingOptionDto, UpdateSettingOptionDto } from '../dto/setting-option.dto'
import { WooCommerceSettingGroupEntity } from '../entities/woocommerce-setting-group.entity'
import { WooCommerceSettingOptionEntity } from '../entities/woocommerce-setting-option.entity'
import { WooCommerceClientService } from './woocommerce-client.service'

@Injectable()
export class SettingService {
  private readonly logger = new Logger(SettingService.name)

  constructor(
    private readonly clientService: WooCommerceClientService,
    @InjectRepository(WooCommerceSettingGroupEntity)
    private readonly settingGroupRepository: Repository<WooCommerceSettingGroupEntity>,
    @InjectRepository(WooCommerceSettingOptionEntity)
    private readonly settingOptionRepository: Repository<WooCommerceSettingOptionEntity>,
  ) {}

  /**
   * List all setting options for a group
   */
  async listOptions(storeId: number, groupId: string) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.get(`settings/${groupId}`)

      // Sync to DB
      for (const option of response.data) {
        await this.saveOptionToDb(storeId, groupId, option)
      }

      return response.data
    }
    catch (error) {
      this.logger.error(`Error listing setting options: ${error.message}`, error.stack)
      throw error
    }
  }

  /**
   * Retrieve a setting option
   */
  async retrieveOption(storeId: number, groupId: string, optionId: string) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.get(`settings/${groupId}/${optionId}`)
      await this.saveOptionToDb(storeId, groupId, response.data)
      return response.data
    }
    catch (error) {
      this.logger.error(`Error retrieving setting option: ${error.message}`, error.stack)
      throw error
    }
  }

  /**
   * Update a setting option
   */
  async updateOption(storeId: number, groupId: string, optionId: string, data: UpdateSettingOptionDto) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.put(`settings/${groupId}/${optionId}`, data)
      await this.saveOptionToDb(storeId, groupId, response.data)
      return response.data
    }
    catch (error) {
      this.logger.error(`Error updating setting option: ${error.message}`, error.stack)
      throw error
    }
  }

  /**
   * Batch update setting options
   */
  async batchUpdateOptions(storeId: number, groupId: string, data: BatchSettingOptionDto) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.post(`settings/${groupId}/batch`, data)

      if (response.data.update) {
        for (const option of response.data.update) {
          await this.saveOptionToDb(storeId, groupId, option)
        }
      }

      return response.data
    }
    catch (error) {
      this.logger.error(`Error batch updating setting options: ${error.message}`, error.stack)
      throw error
    }
  }

  private async saveOptionToDb(storeId: number, groupId: string, data: any) {
    const entity = this.settingOptionRepository.create({
      id: data.id,
      store_id: storeId,
      group_id: groupId,
      label: data.label,
      description: data.description,
      value: typeof data.value === 'string' ? data.value : JSON.stringify(data.value),
      default: typeof data.default === 'string' ? data.default : JSON.stringify(data.default),
      tip: data.tip,
      placeholder: data.placeholder,
      type: data.type,
      options: data.options,
    })
    return this.settingOptionRepository.save(entity)
  }

  /**
   * List all settings groups
   */
  async listGroups(storeId: number) {
    try {
      const client = await this.clientService.getClient(storeId)
      const response = await client.get('settings')

      // Sync to DB
      for (const group of response.data) {
        await this.saveGroupToDb(storeId, group)
      }

      return response.data
    }
    catch (error) {
      this.logger.error(`Error listing setting groups: ${error.message}`, error.stack)
      throw error
    }
  }

  private async saveGroupToDb(storeId: number, data: any) {
    const entity = this.settingGroupRepository.create({
      id: data.id,
      store_id: storeId,
      label: data.label,
      description: data.description,
      parent_id: data.parent_id,
      sub_groups: data.sub_groups,
    })
    return this.settingGroupRepository.save(entity)
  }
}
