// import { IRequestHandler } from '../types/request-handler.interface';
// import { IncomingMessage, ServerResponse } from 'node:http';
//
// export class RequestHandler implements IRequestHandler {
//   public async listener(req: IncomingMessage, res: ServerResponse): Promise<void> {
//     try {
//       if (req.method === 'OPTIONS') {
//         await this.handlePreFlight(req, res);
//       } else {
//         await this.handleRequest(req, res);
//       }
//     } catch (e: any) {
//       this.handleRequestError(e, req, res);
//     } finally {
//       if (!res.writableEnded) {
//         res.end();
//       }
//     }
//   }
//
// }
