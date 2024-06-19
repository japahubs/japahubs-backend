// import { defineFeature, loadFeature } from 'jest-cucumber';
// import { CreatePostUseCase } from './CreatePostUseCase';
// import { mock, MockProxy } from 'jest-mock-extended';
// import { IPostRepo } from '../../repos/postRepo';
// import { CreatePostDTO } from './CreatePostDTO';
// import { PostBuilder } from '../../../../shared/tests/posts/builders/postBuilder';
// import { IUserRepo } from '../../../../modules/users/repos/userRepo';
// import { UseCaseResponse } from '../../../../shared/tests/types/UseCaseResponse';
// import path from 'path';

// const feature = loadFeature(path.join(__dirname, './create-post.feature'));

// defineFeature(feature, (test) => {
//   let mockedPostRepo: MockProxy<IPostRepo>;
//   let mockedUserRepo: MockProxy<IUserRepo>;
//   let sut: CreatePostUseCase;

//   beforeEach(() => {
//     mockedPostRepo = mock<IPostRepo>();
//     mockedUserRepo = mock<IUserRepo>();

//     sut = new CreatePostUseCase(mockedPostRepo, mockedUserRepo);

//     mockedUserRepo.exists.mockResolvedValue(true);
//   });

//   test('Submitting a post', ({ given, when, then }) => {
//     let createPostDTO: CreatePostDTO;
//     let response: UseCaseResponse<CreatePostUseCase>;

//     given('I am an authenticated user', async () => {
//       createPostDTO = new PostBuilder().withRandomValues().build();
//     });

//     when('I submit a post with valid post details', async () => {
//       response = await sut.execute(createPostDTO);
//     });

//     then('I should be able to interact with the post', () => {
//       expect(response.isRight()).toBeTruthy();
//       expect(response.value.getValue()).toBeUndefined();

//       expect(mockedUserRepo.exists).toHaveBeenCalledTimes(1);
//       expect(mockedPostRepo.save).toHaveBeenCalledTimes(1);
//     });
//   });

//   test('Invalid or missing post details', ({ given, when, then }) => {
//     let createPostDTO: CreatePostDTO;
//     let response: UseCaseResponse<CreatePostUseCase>;

//     given('I am an authenticated user', () => {
//       createPostDTO = new PostBuilder().withRandomValues().withTitle('').build();
//     });

//     when('I submit a post with invalid or missing post details', async () => {
//       response = await sut.execute(createPostDTO);
//     });

//     then('I should be informed of which details are invalid or missing', () => {
//       expect(response.isRight()).toBeFalsy();

//       expect(mockedUserRepo.exists).toHaveBeenCalledTimes(0);
//       expect(mockedPostRepo.save).toHaveBeenCalledTimes(0);
//     });
//   });

//   test("User doesn't exist", ({ given, when, then }) => {
//     given('I am an authenticated user', () => {});

//     when("I submit a post with a user that doesn't exist", () => {});

//     then("I should be informed that the user doesn't exist", () => {});
//   });
// });
