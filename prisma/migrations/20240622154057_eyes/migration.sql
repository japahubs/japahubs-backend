-- CreateEnum
CREATE TYPE "userRole" AS ENUM ('USER', 'ADMIN', 'CREATOR');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "phone" TEXT,
    "gender" TEXT,
    "bio" TEXT,
    "imageUrl" TEXT,
    "country" TEXT,
    "language" TEXT NOT NULL,
    "dateofbirth" TIMESTAMP(3),
    "active" BOOLEAN,
    "reported" BOOLEAN,
    "deactivated" BOOLEAN,
    "lastActivity" TIMESTAMP(3),
    "postCount" INTEGER,
    "journalCount" INTEGER,
    "opportunityCount" INTEGER,
    "googleId" INTEGER,
    "links" TEXT[],
    "password" TEXT NOT NULL,
    "role" "userRole" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastMessageDate" TIMESTAMP(3),
    "adminIds" TEXT[],

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ConversationUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "conversationId" TEXT,
    "isReply" BOOLEAN NOT NULL DEFAULT false,
    "replyToId" TEXT,
    "images" TEXT[],

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PinnedMessage" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "pinnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PinnedMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Posts" (
    "id" TEXT NOT NULL,
    "images" TEXT[],
    "slug" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalNumViews" INTEGER NOT NULL,
    "totalNumLikes" INTEGER NOT NULL,
    "totalNumComments" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostCaptionTags" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "PostCaptionTags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostsComments" (
    "id" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "parentId" TEXT,
    "postId" TEXT NOT NULL,

    CONSTRAINT "PostsComments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostCommentsTags" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "postCommendId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "PostCommentsTags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Journals" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Journals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalsCaptionTags" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "journalId" TEXT NOT NULL,

    CONSTRAINT "JournalsCaptionTags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalsComments" (
    "id" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "parentId" TEXT,
    "journalsId" TEXT NOT NULL,

    CONSTRAINT "JournalsComments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalsCommentsTags" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "journalCommendId" TEXT NOT NULL,
    "journalId" TEXT NOT NULL,

    CONSTRAINT "JournalsCommentsTags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Opportunities" (
    "id" TEXT NOT NULL,
    "title" TEXT[],
    "imageUrl" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "description" TEXT[],
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpportunitiesCaptionTags" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "opportunitiesId" TEXT NOT NULL,

    CONSTRAINT "OpportunitiesCaptionTags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpportunitiesComments" (
    "id" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "opportunitiesId" TEXT NOT NULL,
    "parentId" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpportunitiesComments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpportunitiesCommentsTags" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "opportunitiesCommentId" TEXT NOT NULL,
    "opportunitiesId" TEXT NOT NULL,

    CONSTRAINT "OpportunitiesCommentsTags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Followers" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leaderId" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,

    CONSTRAINT "Followers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Likes" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "postId" TEXT,
    "journalId" TEXT,
    "opportunitiesId" TEXT,

    CONSTRAINT "Likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentLikes" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "postsCommentsId" TEXT,
    "journalsCommentsId" TEXT,
    "opportunitiesCommentsId" TEXT,

    CONSTRAINT "CommentLikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Saves" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "postId" TEXT,
    "journalId" TEXT,
    "opportunitiesId" TEXT,
    "postCommentsId" TEXT,
    "journalsCommentsId" TEXT,
    "opportunitiesCommentsId" TEXT,

    CONSTRAINT "Saves_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_phone_key" ON "Users"("phone");

-- AddForeignKey
ALTER TABLE "ConversationUser" ADD CONSTRAINT "ConversationUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationUser" ADD CONSTRAINT "ConversationUser_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PinnedMessage" ADD CONSTRAINT "PinnedMessage_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PinnedMessage" ADD CONSTRAINT "PinnedMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostCaptionTags" ADD CONSTRAINT "PostCaptionTags_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostCaptionTags" ADD CONSTRAINT "PostCaptionTags_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostsComments" ADD CONSTRAINT "PostsComments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostsComments" ADD CONSTRAINT "PostsComments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostsComments" ADD CONSTRAINT "PostsComments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "PostsComments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostCommentsTags" ADD CONSTRAINT "PostCommentsTags_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostCommentsTags" ADD CONSTRAINT "PostCommentsTags_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostCommentsTags" ADD CONSTRAINT "PostCommentsTags_postCommendId_fkey" FOREIGN KEY ("postCommendId") REFERENCES "PostsComments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Journals" ADD CONSTRAINT "Journals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalsCaptionTags" ADD CONSTRAINT "JournalsCaptionTags_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalsCaptionTags" ADD CONSTRAINT "JournalsCaptionTags_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "Journals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalsComments" ADD CONSTRAINT "JournalsComments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "JournalsComments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalsComments" ADD CONSTRAINT "JournalsComments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalsComments" ADD CONSTRAINT "JournalsComments_journalsId_fkey" FOREIGN KEY ("journalsId") REFERENCES "Journals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalsCommentsTags" ADD CONSTRAINT "JournalsCommentsTags_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalsCommentsTags" ADD CONSTRAINT "JournalsCommentsTags_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "Journals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalsCommentsTags" ADD CONSTRAINT "JournalsCommentsTags_journalCommendId_fkey" FOREIGN KEY ("journalCommendId") REFERENCES "JournalsComments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opportunities" ADD CONSTRAINT "Opportunities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpportunitiesCaptionTags" ADD CONSTRAINT "OpportunitiesCaptionTags_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpportunitiesCaptionTags" ADD CONSTRAINT "OpportunitiesCaptionTags_opportunitiesId_fkey" FOREIGN KEY ("opportunitiesId") REFERENCES "Opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpportunitiesComments" ADD CONSTRAINT "OpportunitiesComments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "OpportunitiesComments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpportunitiesComments" ADD CONSTRAINT "OpportunitiesComments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpportunitiesComments" ADD CONSTRAINT "OpportunitiesComments_opportunitiesId_fkey" FOREIGN KEY ("opportunitiesId") REFERENCES "Opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpportunitiesCommentsTags" ADD CONSTRAINT "OpportunitiesCommentsTags_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpportunitiesCommentsTags" ADD CONSTRAINT "OpportunitiesCommentsTags_opportunitiesId_fkey" FOREIGN KEY ("opportunitiesId") REFERENCES "Opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpportunitiesCommentsTags" ADD CONSTRAINT "OpportunitiesCommentsTags_opportunitiesCommentId_fkey" FOREIGN KEY ("opportunitiesCommentId") REFERENCES "OpportunitiesComments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Followers" ADD CONSTRAINT "Followers_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Followers" ADD CONSTRAINT "Followers_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "Journals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_opportunitiesId_fkey" FOREIGN KEY ("opportunitiesId") REFERENCES "Opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLikes" ADD CONSTRAINT "CommentLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLikes" ADD CONSTRAINT "CommentLikes_postsCommentsId_fkey" FOREIGN KEY ("postsCommentsId") REFERENCES "PostsComments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLikes" ADD CONSTRAINT "CommentLikes_journalsCommentsId_fkey" FOREIGN KEY ("journalsCommentsId") REFERENCES "JournalsComments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLikes" ADD CONSTRAINT "CommentLikes_opportunitiesCommentsId_fkey" FOREIGN KEY ("opportunitiesCommentsId") REFERENCES "OpportunitiesComments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saves" ADD CONSTRAINT "Saves_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saves" ADD CONSTRAINT "Saves_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saves" ADD CONSTRAINT "Saves_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "Journals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saves" ADD CONSTRAINT "Saves_opportunitiesId_fkey" FOREIGN KEY ("opportunitiesId") REFERENCES "Opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saves" ADD CONSTRAINT "Saves_postCommentsId_fkey" FOREIGN KEY ("postCommentsId") REFERENCES "PostsComments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saves" ADD CONSTRAINT "Saves_journalsCommentsId_fkey" FOREIGN KEY ("journalsCommentsId") REFERENCES "JournalsComments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saves" ADD CONSTRAINT "Saves_opportunitiesCommentsId_fkey" FOREIGN KEY ("opportunitiesCommentsId") REFERENCES "OpportunitiesComments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
