// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {collection,QueryDocumentSnapshot,DocumentData,query,where,limit,getDocs} from "@firebase/firestore";
import { v4 as uuidv4 } from 'uuid';

type Todo = {
  id: string,
  title: string,
  completed: boolean
}
let todos: Todo[] = [];
export default async function handler(req: NextApiRequest,  res: NextApiResponse<Todo | Todo[] | {message:string}>) 
{
  const { method, body, query } = req;

  switch (method) {
    case "GET":
      res.status(200).json(todos);
      break;

    case "POST":
      let newTodo: Todo = {
        id: uuidv4(),
        title: String(body.title),
        completed: false
      };


      todos.push(newTodo);
      res.status(201).json(newTodo);
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
      const deletedTodo: Todo[] = todos.filter((todo) => todo.id !== query.id);
      todos = deletedTodo;
      res.status(200).json(deletedTodo);
      break;


    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
