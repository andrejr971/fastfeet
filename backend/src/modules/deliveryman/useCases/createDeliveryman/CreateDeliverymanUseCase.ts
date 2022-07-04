
import { Deliveryman } from "@prisma/client";
import { hash } from "bcrypt";
import { prisma } from "../../../../database/primaClient";


interface CreateDeliveryman {
  username: string;
  password: string;
}

export class CreateDeliverymanUseCase {
  async execute({ password, username }: CreateDeliveryman): Promise<Deliveryman> {
    // Validar se o usuário existe
    const deliverymanExist = await prisma.deliveryman.findFirst({
      where: { 
        username: {
          mode: "insensitive"
        }
      }
    });

    if (deliverymanExist) {
      throw new Error('Deliveryman already exists');
    }

    // criptografar a senha
    const hashPassword = await hash(password, 10);

    // Salvar o client
    return prisma.deliveryman.create({
      data: {
        username,
        password: hashPassword
      }
    })

  }
}