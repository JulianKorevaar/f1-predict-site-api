import { NextApiRequest, NextApiResponse } from 'next';

import { connect } from '../../../../utils/connection';
import { ResponseFuncs } from '../../../utils/types';

const allowCors =
  (fn: {
    (req: NextApiRequest, res: NextApiResponse<any>): Promise<void>;
    (arg0: any, arg1: any): any;
  }) =>
  async (req: any, res: any): Promise<void> => {
    // Add Promise<void> here
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,OPTIONS,PATCH,DELETE,POST,PUT'
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return undefined; // Add return statement here
    }
    return fn(req, res);
  };

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // capture request method, we type it as a key of ResponseFunc to reduce typing later
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;

  // function for catch errors
  const catcher = (error: Error) => res.status(400).json({ error });

  // Potential Responses
  const handleCase: ResponseFuncs = {
    // RESPONSE FOR GET REQUESTS
    GET: async (_req: NextApiRequest, resGET: NextApiResponse) => {
      const { User } = await connect(); // connect to database
      resGET.json(await User.find({}).catch(catcher));
    },
    // RESPONSE POST REQUESTS
    POST: async (reqPOST: NextApiRequest, resPOST: NextApiResponse) => {
      const { User } = await connect(); // connect to database
      resPOST.json(await User.create(reqPOST.body).catch(catcher));
    },
  };

  // Check if there is a response for the particular method, if so invoke it, if not response with an error
  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: 'No Response for This Request' });
};

export default allowCors(handler);
