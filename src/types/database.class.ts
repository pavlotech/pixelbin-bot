export class Database {
  private prisma: any;
  public logger: any;

  constructor(prisma: any, logger: any) {
    this.prisma = prisma;
    this.logger = logger;
  }
  public async findUnique (entity: string, criteria: Record<string, any>) {
    try {
      const result = await this.prisma[entity].findUnique({ where: criteria });
  
      if (!result) return false;
  
      return result;
    } catch (error) {
      this.logger.error(error);
    }
  }
  public async update (entity: string, criteria: Record<string, any>, updatedData: Record<string, any>) {
    try {
      const result = await this.prisma[entity].update({
        where: criteria,
        data: updatedData,
      });
  
      return result;
    } catch (error) {
      this.logger.error(error);
    }
  }
  public async create (entity: string, data: Record<string, any>) {
    try {
      const result = await this.prisma[entity].create({
        data,
      });
  
      return result;
    } catch (error) {
      this.logger.error(error);
    }
  }
  public async findMany (entity: string) {
    try {
      const result = await this.prisma[entity].findMany();

      return result;
    } catch (error) {
      this.logger.error(error);
    }
  }
  public async delete (entity: string, criteria: Record<string, any>) {
    try {
      const result = await this.prisma[entity].delete({
        where: criteria,
      });

      return result;
    } catch (error) {
      this.logger.error(error);
    }
  }
}