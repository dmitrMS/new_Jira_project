import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const mark = await prisma.user.upsert({
    // where: { login: 'mark160403' },
    update: {},
    create: {
      login: 'mark160403',
      password: 'mark66',
      created_at: '2024-02-27T00:00:00.000Z',
      updated_at: '2024-02-28T00:00:00.000Z',
      work_time: {
        create: {
          begin_date: '2024-02-27T00:00:00.000Z',
          end_date: '2024-02-28T00:00:00.000Z',
          created_at: '2024-02-27T00:00:00.000Z',
          updated_at: '2024-02-28T00:00:00.000Z'
        }
      }
    }
  });
  const dmitry = await prisma.user.upsert({
    // where: { login: 'dmitry' },
    update: {},
    create: {
      login: 'dmitry',
      password: 'P@ssw0rd',
      created_at: '2024-02-27T00:00:00.000Z',
      updated_at: '2024-02-28T00:00:00.000Z',
      work_time: {
        create: [
          {
            begin_date: '2024-02-27T00:00:00.000Z',
          end_date: '2024-02-28T00:00:00.000Z',
          created_at: '2024-02-27T00:00:00.000Z',
          updated_at: '2024-02-28T00:00:00.000Z'
          },
          {
            begin_date: '2024-03-01T00:00:00.000Z',
          end_date: '2024-03-02T00:00:00.000Z',
          created_at: '2024-03-01T00:00:00.000Z',
          updated_at: '2024-03-02T00:00:00.000Z'
          }
        ]
      }
    }
  });
  console.log({ mark, dmitry });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });