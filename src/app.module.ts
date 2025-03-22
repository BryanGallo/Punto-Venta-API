import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { typeOrmConfig } from './config/typeorm.config';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { TransactionsModule } from './transactions/transactions.module';
import { PrinterModule } from './printer/printer.module';
import { AdminReportsModule } from './reports/admin-reports/admin-reports.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: '.env',
    }),
    //? usando Fn TypeOrmModule para poderle pasar en los imports porque es un modulo, debe estar despues de las configuracion de variables de entorno pero antes de otros Modulos
    TypeOrmModule.forRootAsync({
      useFactory: typeOrmConfig,
      inject: [ConfigService],
    }),
    CategoriesModule,
    ProductsModule,
    AuthModule,
    RolesModule,
    TransactionsModule,
    PrinterModule,
    AdminReportsModule
  ],
})
export class AppModule {}
