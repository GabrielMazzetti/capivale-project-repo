import { Request, Response } from 'express';
import { Question, IQuestion } from '../models/Question'; // Import Mongoose Question model and interface
import { Types } from 'mongoose'; // Import Types for ObjectId

export const createQuestion = async (req: Request, res: Response) => {
  try {
    const { question, answer } = req.body;
    const newQuestion = await Question.create({ question, answer }); // Mongoose create
    return res.status(201).json(newQuestion);
  } catch (error: any) {
    console.error('Error creating question:', error);
    return res.status(500).json({ message: 'Error creating question', error: error.message });
  }
};

export const getAllQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await Question.find(); // Mongoose find
    return res.status(200).json(questions);
  } catch (error: any) {
    console.error('Error fetching questions:', error);
    return res.status(500).json({ message: 'Error fetching questions', error: error.message });
  }
};

export const getQuestionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) { // Validate ObjectId
        return res.status(400).json({ message: 'Invalid question ID format.' });
    }

    const question = await Question.findById(id); // Mongoose findById
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    return res.status(200).json(question);
  } catch (error: any) {
    console.error('Error fetching question by ID:', error);
    return res.status(500).json({ message: 'Error fetching question', error: error.message });
  }
};

export const updateQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;

    if (!Types.ObjectId.isValid(id)) { // Validate ObjectId
        return res.status(400).json({ message: 'Invalid question ID format.' });
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      { question, answer },
      { new: true } // Return the updated document
    ); // Mongoose findByIdAndUpdate

    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }
    return res.status(200).json(updatedQuestion);
  } catch (error: any) {
    console.error('Error updating question:', error);
    return res.status(500).json({ message: 'Error updating question', error: error.message });
  }
};

export const deleteQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) { // Validate ObjectId
        return res.status(400).json({ message: 'Invalid question ID format.' });
    }

    const deletedQuestion = await Question.findByIdAndDelete(id); // Mongoose findByIdAndDelete
    if (!deletedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }
    return res.status(204).send(); // No content
  } catch (error: any) {
    console.error('Error deleting question:', error);
    return res.status(500).json({ message: 'Error deleting question', error: error.message });
  }
};