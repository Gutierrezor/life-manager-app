const createModelMock = () => ({
  create: jest.fn(),
  createMany: jest.fn(),
  findMany: jest.fn(),
  findUnique: jest.fn(),
  upsert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  deleteMany: jest.fn(),
});

export const prismaMock = {
  user: createModelMock(),
  noteCategory: createModelMock(),
  note: createModelMock(),
  calendarEvent: createModelMock(),
  reminder: createModelMock(),
  habit: createModelMock(),
  habitLog: createModelMock(),
  financeCategory: createModelMock(),
  financeTransaction: createModelMock(),
  $connect: jest.fn(),
  $disconnect: jest.fn(),
};
