// import AppError from '../errors/AppError';

import { getCustomRepository, getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    let transactionCategory = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!transactionCategory) {
      transactionCategory = categoriesRepository.create({ title: category });

      await categoriesRepository.save(transactionCategory);
    }

    const transactions = transactionsRepository.create({
      title,
      value,
      type,
      category: transactionCategory,
    });

    await transactionsRepository.save(transactions);

    return transactions;
  }
}

export default CreateTransactionService;
