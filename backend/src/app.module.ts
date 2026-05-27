import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CatalogModule } from './catalog/catalog.module'; // ← ДОБАВЛЕНО
import { ReceivingModule } from './receiving/receiving.module';
import { RentalModule } from './rental/rental.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    CatalogModule,
    ReceivingModule,
    RentalModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}