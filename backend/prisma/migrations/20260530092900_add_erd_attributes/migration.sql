/*
  Warnings:

  - You are about to drop the `AssemblyTask` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Cell` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Employee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Inventory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InventoryCheck` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InventoryCheckItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InventoryMovement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InventoryType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Receipt` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReceiptItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RentalContract` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RentalContractItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Supplier` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Zone` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AssemblyTask" DROP CONSTRAINT "AssemblyTask_contractId_fkey";

-- DropForeignKey
ALTER TABLE "AssemblyTask" DROP CONSTRAINT "AssemblyTask_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "Cell" DROP CONSTRAINT "Cell_zoneId_fkey";

-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_cellId_fkey";

-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_typeId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryCheckItem" DROP CONSTRAINT "InventoryCheckItem_checkId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryCheckItem" DROP CONSTRAINT "InventoryCheckItem_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryMovement" DROP CONSTRAINT "InventoryMovement_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryMovement" DROP CONSTRAINT "InventoryMovement_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_contractId_fkey";

-- DropForeignKey
ALTER TABLE "Receipt" DROP CONSTRAINT "Receipt_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "ReceiptItem" DROP CONSTRAINT "ReceiptItem_receiptId_fkey";

-- DropForeignKey
ALTER TABLE "ReceiptItem" DROP CONSTRAINT "ReceiptItem_typeId_fkey";

-- DropForeignKey
ALTER TABLE "RentalContract" DROP CONSTRAINT "RentalContract_customerId_fkey";

-- DropForeignKey
ALTER TABLE "RentalContract" DROP CONSTRAINT "RentalContract_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "RentalContractItem" DROP CONSTRAINT "RentalContractItem_contractId_fkey";

-- DropForeignKey
ALTER TABLE "RentalContractItem" DROP CONSTRAINT "RentalContractItem_inventoryId_fkey";

-- DropTable
DROP TABLE "AssemblyTask";

-- DropTable
DROP TABLE "Cell";

-- DropTable
DROP TABLE "Customer";

-- DropTable
DROP TABLE "Employee";

-- DropTable
DROP TABLE "Inventory";

-- DropTable
DROP TABLE "InventoryCheck";

-- DropTable
DROP TABLE "InventoryCheckItem";

-- DropTable
DROP TABLE "InventoryMovement";

-- DropTable
DROP TABLE "InventoryType";

-- DropTable
DROP TABLE "Payment";

-- DropTable
DROP TABLE "Receipt";

-- DropTable
DROP TABLE "ReceiptItem";

-- DropTable
DROP TABLE "RentalContract";

-- DropTable
DROP TABLE "RentalContractItem";

-- DropTable
DROP TABLE "Supplier";

-- DropTable
DROP TABLE "Zone";

-- CreateTable
CREATE TABLE "zone" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cell" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "zoneId" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 1,
    "status" VARCHAR(20) NOT NULL DEFAULT 'available',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cell_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_type" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "rental_price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "deposit" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "requires_assembly" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "contact_person" VARCHAR(100),
    "phone" VARCHAR(20),
    "email" VARCHAR(100),
    "inn" VARCHAR(12),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "role" VARCHAR(50) NOT NULL DEFAULT 'operator',
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20),
    "hire_date" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "email" VARCHAR(100),
    "passport_id" VARCHAR(20),
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "serial_number" VARCHAR(100) NOT NULL,
    "typeId" INTEGER NOT NULL,
    "cellId" INTEGER NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'available',
    "condition" VARCHAR(50) NOT NULL DEFAULT 'new',
    "purchase_date" TIMESTAMP(3),
    "purchase_price" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rental_contract" (
    "id" SERIAL NOT NULL,
    "number" VARCHAR(50) NOT NULL,
    "customerId" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'active',
    "total_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "deposit_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rental_contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rental_contract_item" (
    "id" SERIAL NOT NULL,
    "contractId" INTEGER NOT NULL,
    "inventoryId" INTEGER NOT NULL,
    "price_snapshot" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rental_contract_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" SERIAL NOT NULL,
    "contractId" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assembly_task" (
    "id" SERIAL NOT NULL,
    "contractId" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "priority" VARCHAR(20) NOT NULL DEFAULT 'normal',
    "completed_at" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assembly_task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receipt" (
    "id" SERIAL NOT NULL,
    "number" VARCHAR(50) NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR(50) NOT NULL DEFAULT 'draft',
    "total_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "receipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receipt_item" (
    "id" SERIAL NOT NULL,
    "receiptId" INTEGER NOT NULL,
    "typeId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "receipt_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_movement" (
    "id" SERIAL NOT NULL,
    "inventoryId" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_movement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "move_request" (
    "id" SERIAL NOT NULL,
    "number" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR(50) NOT NULL DEFAULT 'pending',
    "employeeId" INTEGER NOT NULL,
    "fromCellId" INTEGER,
    "toCellId" INTEGER,
    "reason" TEXT,
    "priority" VARCHAR(20) NOT NULL DEFAULT 'normal',
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "move_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movement_operation" (
    "id" SERIAL NOT NULL,
    "requestId" INTEGER NOT NULL,
    "inventoryId" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "fromCellId" INTEGER,
    "toCellId" INTEGER,
    "completedAt" TIMESTAMP(3),
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movement_operation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_check" (
    "id" SERIAL NOT NULL,
    "number" VARCHAR(50) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "scheduled_date" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_check_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_check_item" (
    "id" SERIAL NOT NULL,
    "checkId" INTEGER NOT NULL,
    "inventoryId" INTEGER NOT NULL,
    "expectedStatus" VARCHAR(50),
    "actualStatus" VARCHAR(50),
    "discrepancy" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_check_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employee_email_key" ON "employee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_serial_number_key" ON "inventory"("serial_number");

-- CreateIndex
CREATE UNIQUE INDEX "rental_contract_number_key" ON "rental_contract"("number");

-- CreateIndex
CREATE UNIQUE INDEX "assembly_task_contractId_key" ON "assembly_task"("contractId");

-- CreateIndex
CREATE UNIQUE INDEX "receipt_number_key" ON "receipt"("number");

-- CreateIndex
CREATE UNIQUE INDEX "move_request_number_key" ON "move_request"("number");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_check_number_key" ON "inventory_check"("number");

-- AddForeignKey
ALTER TABLE "cell" ADD CONSTRAINT "cell_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "zone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "inventory_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_cellId_fkey" FOREIGN KEY ("cellId") REFERENCES "cell"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental_contract" ADD CONSTRAINT "rental_contract_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental_contract" ADD CONSTRAINT "rental_contract_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental_contract_item" ADD CONSTRAINT "rental_contract_item_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "rental_contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental_contract_item" ADD CONSTRAINT "rental_contract_item_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "rental_contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assembly_task" ADD CONSTRAINT "assembly_task_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "rental_contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assembly_task" ADD CONSTRAINT "assembly_task_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipt" ADD CONSTRAINT "receipt_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipt_item" ADD CONSTRAINT "receipt_item_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "receipt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipt_item" ADD CONSTRAINT "receipt_item_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "inventory_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movement" ADD CONSTRAINT "inventory_movement_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movement" ADD CONSTRAINT "inventory_movement_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "move_request" ADD CONSTRAINT "move_request_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "move_request" ADD CONSTRAINT "move_request_fromCellId_fkey" FOREIGN KEY ("fromCellId") REFERENCES "cell"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "move_request" ADD CONSTRAINT "move_request_toCellId_fkey" FOREIGN KEY ("toCellId") REFERENCES "cell"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movement_operation" ADD CONSTRAINT "movement_operation_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "move_request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movement_operation" ADD CONSTRAINT "movement_operation_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movement_operation" ADD CONSTRAINT "movement_operation_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_check" ADD CONSTRAINT "inventory_check_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_check_item" ADD CONSTRAINT "inventory_check_item_checkId_fkey" FOREIGN KEY ("checkId") REFERENCES "inventory_check"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_check_item" ADD CONSTRAINT "inventory_check_item_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
