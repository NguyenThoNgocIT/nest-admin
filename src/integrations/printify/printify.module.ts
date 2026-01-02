import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { PrintifyService } from '~/integrations/printify/printify.service'

@Module({
  imports: [HttpModule],
  providers: [PrintifyService],
  exports: [PrintifyService],
})
export class PrintifyModule {}
