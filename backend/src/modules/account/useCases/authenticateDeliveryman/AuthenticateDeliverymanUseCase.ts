import { Deliveryman } from "@prisma/client";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { prisma } from "../../../../database/primaClient";

interface IAuthenticateDeliveryman {
  username: string;
  password: string;
}

interface IResponse {
  deliveryman: Deliveryman;
  token: string;
}

export class AuthenticateDeliverymanUseCase {
  async execute({ password, username }: IAuthenticateDeliveryman): Promise<IResponse> {
    const deliveryman = await prisma.clients.findFirst({
      where: {
        username,
      },
    });

    if (!deliveryman) {
      throw new Error('Username or password incorrect');
    }
    
    const passwordMatch = await compare(password, deliveryman.password);
    
    if (!passwordMatch) {
      throw new Error('Username or password incorrect');
    }

    const token = sign({ username }, '3b3fc9c5c65dd14b852d5b75feb6c02c816e007ac6', {
      subject: deliveryman.id,
      expiresIn: '1d'
    });

    return {
      deliveryman,
      token,
    }
  }
}