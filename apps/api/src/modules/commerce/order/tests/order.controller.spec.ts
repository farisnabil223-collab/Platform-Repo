import { Test, TestingModule } from '@nestjs/testing';
import { OrderStudentController } from '../presentation/order-student.controller';
import { OrderAdminController } from '../presentation/order-admin.controller';
import { OrderService } from '../application/order.service';

describe('OrderControllers', () => {
  let studentController: OrderStudentController;
  let adminController: OrderAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderStudentController, OrderAdminController],
      providers: [
        {
          provide: OrderService,
          useValue: {
            createOrderFromCart: jest.fn().mockResolvedValue({}),
            getOrders: jest.fn().mockResolvedValue({ items: [], total: 0 }),
            getOrderById: jest.fn().mockResolvedValue({}),
            updateOrderStatus: jest.fn().mockResolvedValue({}),
            getOrderTimeline: jest.fn().mockResolvedValue([]),
            getInvoiceByOrderNumber: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    studentController = module.get<OrderStudentController>(OrderStudentController);
    adminController = module.get<OrderAdminController>(OrderAdminController);
  });

  it('should be defined', () => {
    expect(studentController).toBeDefined();
    expect(adminController).toBeDefined();
  });
});
