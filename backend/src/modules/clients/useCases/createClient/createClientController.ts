import { Request, Response } from "express";
import { CreateclientUseCase } from "./createClientUseCase";

export class CreateClientController {
  async handle(request: Request, response: Response) {
    const createclientUseCase = new CreateclientUseCase();

    const { name, username, password} = request.body;

    const client = await createclientUseCase.execute({
      name,
      username,
      password,
    });

    return response.json(client);
}
}