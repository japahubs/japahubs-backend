import { Response } from "express";
import { prismaClient } from "../../../shared/infra/persistence"
import { UniqueEntityID } from "../../../shared";
import { DecodedExpressRequest } from "../../../shared";

const db = prismaClient;

export const newMessage = async (req: DecodedExpressRequest, res: Response) => {
  const { text, conversationId } = req.body;
  const { userId } = req.decoded;

  if (!text || text.trim() === "")
    return res.status(400).json({ text: "Must provide a text" });

  if (!conversationId)
    return res.status(400).json({ text: "Must provide a conversationId" });

  const authorId = userId;
 
  try {
    const newMessage = await db.message.create({
      data: {
        id: new UniqueEntityID().toString(),
        text,
        authorId: authorId,
        conversationId: conversationId,
      },
      include: {
        conversation: {
          include: {
            participants: true,
          },
        },
      },
    });

    // Update lastMessageDate
    const conversation = newMessage.conversation;
    if (conversation) {
      await db.conversation.update({
        where: { id: conversation.id },
        data: { lastMessageDate: new Date() },
      });
    }

    // Set all participants' isRead to false except author
    conversation?.participants
      .filter((participant) => participant.userId !== authorId)
      .map(async (participant) => {
        await db.conversationUser.updateMany({
          where: {
            conversationId: conversationId,
            userId: participant.userId,
          },
          data: { isRead: false },
        });
      });

    const response = {
      id: newMessage.id,
      text: newMessage.text,
      authorId: newMessage.authorId,
      created_at: newMessage.created_at,
    };
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

export const getMessagesInConversation = async (
  req: DecodedExpressRequest,
  res: Response
) => {
  const { userId } = req.decoded;
  const { page = 1, limit = 10 } = req.query;
  const { conversationId } = req.query as { conversationId: string };

  if (!conversationId)
    return res.status(400).json({ message: "Must provide a conversationId" });

  const currentUserId = userId;
  const parsedPage = parseInt(page as string);
  const parsedLimit = parseInt(limit as string);

  try {
    const conversation = await db.conversation.findUnique({
      where: { id: conversationId},
      include: { participants: true },
    });
    if (
      conversation?.participants[0].userId !== currentUserId &&
      conversation?.participants[1].userId !== currentUserId
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await db.conversationUser.updateMany({
      where: {
        conversationId: conversationId,
        userId: currentUserId,
      },
      data: { isRead: true },
    });

    let messages;
    if (page) {
      messages = await db.message.findMany({
        where: {
          conversationId: conversationId,
        },
        orderBy: { created_at: "desc" },
        skip: (parsedPage - 1) * parsedLimit,
        take: parsedLimit,
        include: {
          author: {
            select: { username: true, imageUrl: true },
          },
        },
      });
    } else {
      messages = await db.message.findMany({
        where: {
          conversationId: conversationId,
        },
        orderBy: { created_at: "desc" },
        include: {
          author: {
            select: { username: true, imageUrl: true },
          },
        },
      });
    }
    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

export const deleteMessage = async (req: DecodedExpressRequest, res: Response) => {
  const id = req.params.id;
  const { userId } = req.decoded;
  try {
    const message = await db.message.findUnique({
      where: { id },
    });

    if (message?.authorId !== userId) {
      return res
        .status(403)
        .json({ message: "You can only delete your own messages" });
    }

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    await db.message.delete({
      where: { id },
    });

    res
      .status(200)
      .json({ message: "Message deleted successfully", messageId: id });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
