import express from 'express';

export function withdraw(req: express.Request, res: express.Response) {
  res.send('withdraw');
}
