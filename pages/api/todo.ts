// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {getAllTodo} from "../index.tsx"
import { v4 as uuidv4 } from 'uuid';

type Todo = {
  id: "string",
  title: "string",
  completed: "false"
}
let todos: Todo[] = [];
export default async function handler(req: NextApiRequest,  res: NextApiResponse<Data>) 
{
  const { method, body, query } = req;

  switch (method) {
    case "GET":
      res.status(200).json(todos);
      break;

    case "POST":
      const newTodo: Todo = {
        id: uuidv4(),
        title: body.title,
        completed: false
      };
      todos.push(newTodo);
      res.status(201).json(newTodo);
      break;
      todos = todos.map((todo) =>
        todo.id === updatedTodo.id ? updatedTodo : todo
      );
      res.status(200).json(updatedTodo);
      break;

      case "PUT":
      const updatedTodo: Todo | undefined = todos.find(todo => todo.id === query.id);
      if (!updatedTodo) {
        res.status(404).json({ message: "Todo not found" });
        return;
      } 
      if (body.title) {
        updatedTodo.title = body.title;
      }
    
      if (typeof body.completed === "boolean") {
        updatedTodo.completed = body.completed;
      }
      res.status(200).json(updatedTodo);
      break;
    case "DELETE":
      const deletedTodo: Todo = todos.filter((todo) => todo.id === query.id);
      todos = deletedTodo;
      res.status(200).json(deletedTodo);
      break;


    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
