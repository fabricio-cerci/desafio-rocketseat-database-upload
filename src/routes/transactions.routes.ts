import { Router } from 'express';
import multer from 'multer';

import { getCustomRepository } from 'typeorm';
import uploadConfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const upload = multer(uploadConfig);

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const balance = await transactionsRepository.getBalance();

  const transactions = await transactionsRepository.find();

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  // Service to create
  const createTransaction = new CreateTransactionService();

  const transactions = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transactions);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  // Service to delete
  const deleteTransaction = new DeleteTransactionService();

  await deleteTransaction.execute({ id });

  return response.status(204).json();
});

transactionsRouter.post(
  '/import',
  upload.single('csvFile'),
  async (request, response) => {
    const importTransaction = new ImportTransactionsService();

    await importTransaction.execute({ filePath: request.file.path });

    return response.json({ ok: true });
  },
);

export default transactionsRouter;
