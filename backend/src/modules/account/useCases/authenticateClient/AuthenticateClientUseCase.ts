import { Clients } from "@prisma/client";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { prisma } from "../../../../database/primaClient";

interface IAuthenticateClient {
  username: string;
  password: string;
}

interface IResponse {
  client: Clients;
  token: string;
}

export class AuthenticateClientUseCase {
  async execute({ password, username }: IAuthenticateClient): Promise<IResponse> {
    const client = await prisma.clients.findFirst({
      where: {
        username,
      }
    });

    if (!client) {
      throw new Error('Username or password incorrect');
    }
    
    const passwordMatch = await compare(password, client.password);
    
    if (!passwordMatch) {
      throw new Error('Username or password incorrect');
    }

    const token = sign({ username }, '3b3fc9c5c6514b852d5b75feb6c02c816e007ac6', {
      subject: client.id,
      expiresIn: '1d'
    });

    return {
      client,
      token,
    }
  }
}