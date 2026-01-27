import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreateCustomerDto, UpdateCustomerDto } from '../dto/create-customer.dto'
import { CustomerService } from '../services/customer.service'

@ApiTags('WooCommerce Customers - Quản lý khách hàng')
@Controller('integrations/woocommerce/customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post(':storeId')
  @ApiOperation({ summary: 'Tạo khách hàng mới trên WooCommerce' })
  async create(@Param('storeId') storeId: number, @Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.createCustomer(storeId, createCustomerDto)
  }

  @Get(':storeId')
  @ApiOperation({ summary: 'Lấy danh sách khách hàng từ WooCommerce' })
  async findAll(@Param('storeId') storeId: number, @Query() query: any) {
    return this.customerService.getCustomers(storeId, query)
  }

  @Get(':storeId/:id')
  @ApiOperation({ summary: 'Lấy chi tiết khách hàng từ WooCommerce' })
  async findOne(@Param('storeId') storeId: number, @Param('id') id: number) {
    return this.customerService.getCustomer(storeId, id)
  }

  @Put(':storeId/:id')
  @ApiOperation({ summary: 'Cập nhật khách hàng trên WooCommerce' })
  async update(
    @Param('storeId') storeId: number,
    @Param('id') id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.updateCustomer(storeId, id, updateCustomerDto)
  }

  @Delete(':storeId/:id')
  @ApiOperation({ summary: 'Xóa khách hàng trên WooCommerce' })
  async remove(@Param('storeId') storeId: number, @Param('id') id: number, @Query('force') force: boolean) {
    return this.customerService.deleteCustomer(storeId, id, force)
  }

  @Get(':storeId/:id/downloads')
  @ApiOperation({ summary: 'Lấy danh sách file download của khách hàng' })
  async getDownloads(@Param('storeId') storeId: number, @Param('id') id: number) {
    return this.customerService.getCustomerDownloads(storeId, id)
  }

  @Post(':storeId/sync')
  @ApiOperation({ summary: 'Đồng bộ khách hàng từ WooCommerce về database' })
  async sync(@Param('storeId') storeId: number) {
    return this.customerService.syncCustomers(storeId)
  }
}
