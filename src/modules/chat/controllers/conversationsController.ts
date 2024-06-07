import { Request, Response } from "express";
import { prismaClient } from "../../../shared/infra/persistence"
import { UniqueEntityID } from "../../../shared";
import { DecodedExpressRequest } from "../../../shared";

const db = prismaClient;

export const newConversation = async (req: DecodedExpressRequest, res: Response) => {
  const participantId: string = req.body.participant;
  const { userId } = req.decoded;

  if (!participantId)
    res.status(400).json({ message: "Must provide a participant" });

  if (participantId === userId)
    res.status(400).json({ message: "Cannot have a conversation with yourself" });

  const participants: string[] = [userId, participantId];
  
  try {
    const query = {
      AND: participants.map((participantId) => ({
        participants: {
          some: {
            userId: participantId,
          },
        },
      })),
    };
    // Check if a conversation exists
    const existingConversation = await db.conversation.findMany({
      where: query,
      select: {
        id: true,
        title: true,
        participants: {
          select: {
            user: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                username: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });
    if (existingConversation.length > 0) {
      const response = {
        ...existingConversation[0],
        messages: undefined,
        participants: existingConversation[0].participants.map(
          (participant) => participant.user
        ),
      };
      return res.status(200).json(response);
    }
    // New conversation data
    let data = participants.map((participantId) => ({
        user: { connect: { id: participantId } },
      }));
    
    // Create new conversation
    const conversation = await db.conversation.create({
      data: {
        id: new UniqueEntityID().toString(),
        participants: {
          create: data,
        },
      },
      select: {
        id: true,
        title: true,
        participants: {
          select: {
            user: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                username: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    const response = {
      ...conversation,
      messages: undefined,
      participants: conversation.participants.map(
        (participant) => participant.user
      ),
    };
    res.status(201).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

export const getAllConversations = async (req: Request, res: Response) => {
  const { userId } = req.params;
  
  try {
    const conversations = await db.conversation.findMany({
      where: {
        participants: {
          some: {
            user: {
              id: userId,
            },
          },
        },
      },
      select: {
        id: true,
        title: true,
        messages: {
          select: {
            id: true,
            text: true,
            images: true,
            created_at: true,
          },
          orderBy: {
            created_at: "desc",
          },
          take: 1,
        },
        participants: {
          select: {
            isRead: true,
            user: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                username: true,
                imageUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        lastMessageDate: "desc",
      },
    });
    const response = conversations.map((conversation) => {
      let isRead =
        conversation.participants[0].user.id === userId
          ? conversation.participants[0].isRead
          : conversation.participants[1].isRead;
      return {
        ...conversation,
        lastMessageSent: conversation.messages[0],
        messages: undefined,
        participants: conversation.participants.map(
          (participant) => participant.user
        ),
        isRead: isRead,
      };
    });
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

export const readConversation = async (req: DecodedExpressRequest, res: Response) => {
  const { conversationId } = req.params;
  const { userId } = req.decoded;
  
  try {
    await db.conversationUser.updateMany({
      where: {
        conversationId: conversationId,
        userId: userId,
      },
      data: {
        isRead: true,
      },
    });
    res
      .status(200)
      .json({ message: "Conversation has been read successfully" });
  } catch (err) {
    console.error(err);
  }
};
