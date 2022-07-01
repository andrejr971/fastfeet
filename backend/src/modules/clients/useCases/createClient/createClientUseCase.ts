import { Clients } from "@prisma/client";
import { hash } from "bcrypt";
import { prisma } from "../../../../database/primaClient";


interface CreateClient {
  username: string;
  password: string;
  name: string;
}

export class CreateclientUseCase {
  async execute({ name, password, username }: CreateClient): Promise<Clients> {
    // Validar se o usuário existe
    const clientExist = await prisma.clients.findFirst({
      where: { 
        username: {
          mode: "insensitive"
        }
      },
    });

    if (clientExist) {
      throw new Error('Client already exists');
    }

    // criptografar a senha
    const hashPassword = await hash(password, 10);

    // Salvar o client

    return prisma.clients.create({
      data: {
        name,
        username,
        password: hashPassword
      }
    })

  }
}