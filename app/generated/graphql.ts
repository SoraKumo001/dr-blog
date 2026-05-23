/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type Post_Categories = {
  set?: Array<Post_CategoriesSet> | null | undefined;
};

export type Post_CategoriesSet = {
  id?: string | null | undefined;
};

export type SystemCreate = {
  cardId?: string | null | undefined;
  createdAt?: Date | string | null | undefined;
  description: string;
  iconId?: string | null | undefined;
  id: string;
  title: string;
  updatedAt?: Date | string | null | undefined;
};

export type SignInMutationVariables = Exact<{
  token?: string | null | undefined;
}>;


export type SignInMutation = { signIn: { id: string, name: string, email: string, createdAt: Date | string, updatedAt: Date | string } | null };

export type FindPostQueryVariables = Exact<{
  postId: string;
}>;


export type FindPostQuery = { findFirstPost: { id: string, published: boolean, title: string, content: string, authorId: string, cardId: string | null, createdAt: Date | string, updatedAt: Date | string, publishedAt: Date | string, categories: Array<{ id: string, name: string, createdAt: Date | string, updatedAt: Date | string }> } | null };

export type FindPostsQueryVariables = Exact<{ [key: string]: never; }>;


export type FindPostsQuery = { findManyPost: Array<{ id: string, published: boolean, title: string, authorId: string, cardId: string | null, createdAt: Date | string, updatedAt: Date | string, publishedAt: Date | string, categories: Array<{ id: string, name: string, createdAt: Date | string, updatedAt: Date | string }> }> };

export type CreateOnePostMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateOnePostMutation = { createOnePost: { id: string, published: boolean, title: string, authorId: string, cardId: string | null, createdAt: Date | string, updatedAt: Date | string, publishedAt: Date | string, categories: Array<{ id: string, name: string, createdAt: Date | string, updatedAt: Date | string }> } };

export type DeletePostMutationVariables = Exact<{
  id: string;
}>;


export type DeletePostMutation = { normalizationPostFiles: boolean | null, deletePost: Array<{ __typename: 'Post' }> };

export type UpdatePostMutationVariables = Exact<{
  postId: string;
  title?: string | null | undefined;
  content?: string | null | undefined;
  published?: boolean | null | undefined;
  publishedAt?: Date | string | null | undefined;
  categories?: Post_Categories | null | undefined;
  cardId?: string | null | undefined;
}>;


export type UpdatePostMutation = { normalizationPostFiles: boolean | null, updatePost: Array<{ id: string, published: boolean, title: string, content: string, authorId: string, createdAt: Date | string, updatedAt: Date | string, publishedAt: Date | string, cardId: string | null, categories: Array<{ id: string, name: string, createdAt: Date | string, updatedAt: Date | string }> }> };

export type UploadPostImageMutationVariables = Exact<{
  postId: string;
  file: unknown;
}>;


export type UploadPostImageMutation = { uploadPostImage: { id: string, createdAt: Date | string, updatedAt: Date | string, name: string, mimeType: string } };

export type FindSystemQueryVariables = Exact<{ [key: string]: never; }>;


export type FindSystemQuery = { findFirstSystem: { id: string, title: string, description: string, iconId: string | null, cardId: string | null, createdAt: Date | string, updatedAt: Date | string, icon: { id: string, name: string, mimeType: string, createdAt: Date | string, updatedAt: Date | string } | null } | null };

export type CreateSystemMutationVariables = Exact<{
  input: SystemCreate;
}>;


export type CreateSystemMutation = { createOneSystem: { id: string, title: string, description: string, iconId: string | null, cardId: string | null, createdAt: Date | string, updatedAt: Date | string } };

export type UpdateSystemMutationVariables = Exact<{
  title?: string | null | undefined;
  description?: string | null | undefined;
  icon?: string | null | undefined;
}>;


export type UpdateSystemMutation = { updateSystem: Array<{ id: string, title: string, description: string, iconId: string | null, cardId: string | null, createdAt: Date | string, updatedAt: Date | string, icon: { id: string, name: string, mimeType: string, createdAt: Date | string, updatedAt: Date | string } | null }> };

export type FindCategoryQueryVariables = Exact<{
  id: string;
}>;


export type FindCategoryQuery = { findFirstCategory: { id: string, name: string, createdAt: Date | string, updatedAt: Date | string } | null };

export type FindCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type FindCategoriesQuery = { findManyCategory: Array<{ id: string, name: string, createdAt: Date | string, updatedAt: Date | string }> };

export type CreateCategoryMutationVariables = Exact<{
  name: string;
}>;


export type CreateCategoryMutation = { createOneCategory: { id: string, name: string, createdAt: Date | string, updatedAt: Date | string } };

export type UpdateCategoryMutationVariables = Exact<{
  id: string;
  name: string;
}>;


export type UpdateCategoryMutation = { updateCategory: Array<{ id: string, name: string, createdAt: Date | string, updatedAt: Date | string }> };

export type DeleteCategoryMutationVariables = Exact<{
  id: string;
}>;


export type DeleteCategoryMutation = { deleteCategory: Array<{ id: string, name: string, createdAt: Date | string, updatedAt: Date | string }> };

export type UploadSystemIconMutationVariables = Exact<{
  file: unknown;
}>;


export type UploadSystemIconMutation = { uploadSystemIcon: { id: string, name: string, mimeType: string, createdAt: Date | string, updatedAt: Date | string } | null };

export type UploadPostIconMutationVariables = Exact<{
  postId: string;
  file?: unknown;
}>;


export type UploadPostIconMutation = { uploadPostIcon: { id: string, name: string, mimeType: string, createdAt: Date | string, updatedAt: Date | string } | null };

export type NormalizationPostFilesMutationVariables = Exact<{
  postId: string;
  removeAll?: boolean | null | undefined;
}>;


export type NormalizationPostFilesMutation = { normalizationPostFiles: boolean | null };

export type RestoreMutationVariables = Exact<{
  file: unknown;
}>;


export type RestoreMutation = { restore: boolean | null };

export type BackupMutationVariables = Exact<{ [key: string]: never; }>;


export type BackupMutation = { backup: string };

export type UpdateCorsMutationVariables = Exact<{
  origin?: Array<string> | string | null | undefined;
}>;


export type UpdateCorsMutation = { bucket: { cors: Array<{ origin: Array<string> | null, method: Array<string> | null, responseHeader: Array<string> | null, maxAgeSeconds: number | null }> | null } | null };

export type BucketQueryVariables = Exact<{ [key: string]: never; }>;


export type BucketQuery = { bucket: { cors: Array<{ origin: Array<string> | null, method: Array<string> | null, responseHeader: Array<string> | null, maxAgeSeconds: number | null }> | null } | null };

export type RestoreFilesMutationVariables = Exact<{
  files: Array<unknown> | unknown;
}>;


export type RestoreFilesMutation = { restoreFiles: Array<{ id: string, name: string, mimeType: string, createdAt: Date | string, updatedAt: Date | string }> | null };


export const SignInDocument = gql`
    mutation SignIn($token: String) {
  signIn(token: $token) {
    id
    name
    email
    createdAt
    updatedAt
  }
}
    `;

export function useSignInMutation() {
  return Urql.useMutation<SignInMutation, SignInMutationVariables>(SignInDocument);
};
export const FindPostDocument = gql`
    query FindPost($postId: String!) {
  findFirstPost(where: {id: {eq: $postId}}) {
    id
    published
    title
    content
    authorId
    cardId
    createdAt
    updatedAt
    publishedAt
    categories {
      id
      name
      createdAt
      updatedAt
    }
  }
}
    `;

export function useFindPostQuery(options: Omit<Urql.UseQueryArgs<FindPostQueryVariables>, 'query'>) {
  return Urql.useQuery<FindPostQuery, FindPostQueryVariables>({ query: FindPostDocument, ...options });
};
export const FindPostsDocument = gql`
    query FindPosts {
  findManyPost(orderBy: {publishedAt: Desc}) {
    id
    published
    title
    authorId
    cardId
    createdAt
    updatedAt
    publishedAt
    categories {
      id
      name
      createdAt
      updatedAt
    }
  }
}
    `;

export function useFindPostsQuery(options?: Omit<Urql.UseQueryArgs<FindPostsQueryVariables>, 'query'>) {
  return Urql.useQuery<FindPostsQuery, FindPostsQueryVariables>({ query: FindPostsDocument, ...options });
};
export const CreateOnePostDocument = gql`
    mutation CreateOnePost {
  createOnePost(input: {content: "", published: false}) {
    id
    published
    title
    authorId
    cardId
    createdAt
    updatedAt
    publishedAt
    categories {
      id
      name
      createdAt
      updatedAt
    }
  }
}
    `;

export function useCreateOnePostMutation() {
  return Urql.useMutation<CreateOnePostMutation, CreateOnePostMutationVariables>(CreateOnePostDocument);
};
export const DeletePostDocument = gql`
    mutation DeletePost($id: String!) {
  deletePost(where: {id: {eq: $id}}) {
    __typename
  }
  normalizationPostFiles(postId: $id)
}
    `;

export function useDeletePostMutation() {
  return Urql.useMutation<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument);
};
export const UpdatePostDocument = gql`
    mutation UpdatePost($postId: String!, $title: String, $content: String, $published: Boolean, $publishedAt: DateTime, $categories: Post_categories, $cardId: String) {
  updatePost(
    input: {title: $title, content: $content, published: $published, publishedAt: $publishedAt, categories: $categories, cardId: $cardId}
    where: {id: {eq: $postId}}
  ) {
    id
    published
    title
    content
    authorId
    createdAt
    updatedAt
    publishedAt
    categories {
      id
      name
      createdAt
      updatedAt
    }
    cardId
  }
  normalizationPostFiles(postId: $postId)
}
    `;

export function useUpdatePostMutation() {
  return Urql.useMutation<UpdatePostMutation, UpdatePostMutationVariables>(UpdatePostDocument);
};
export const UploadPostImageDocument = gql`
    mutation UploadPostImage($postId: String!, $file: Upload!) {
  uploadPostImage(postId: $postId, file: $file) {
    id
    createdAt
    updatedAt
    name
    mimeType
  }
}
    `;

export function useUploadPostImageMutation() {
  return Urql.useMutation<UploadPostImageMutation, UploadPostImageMutationVariables>(UploadPostImageDocument);
};
export const FindSystemDocument = gql`
    query FindSystem {
  findFirstSystem(where: {id: {eq: "system"}}) {
    id
    title
    description
    iconId
    cardId
    createdAt
    updatedAt
    icon {
      id
      name
      mimeType
      createdAt
      updatedAt
    }
  }
}
    `;

export function useFindSystemQuery(options?: Omit<Urql.UseQueryArgs<FindSystemQueryVariables>, 'query'>) {
  return Urql.useQuery<FindSystemQuery, FindSystemQueryVariables>({ query: FindSystemDocument, ...options });
};
export const CreateSystemDocument = gql`
    mutation CreateSystem($input: SystemCreate!) {
  createOneSystem(input: $input) {
    id
    title
    description
    iconId
    cardId
    createdAt
    updatedAt
  }
}
    `;

export function useCreateSystemMutation() {
  return Urql.useMutation<CreateSystemMutation, CreateSystemMutationVariables>(CreateSystemDocument);
};
export const UpdateSystemDocument = gql`
    mutation UpdateSystem($title: String, $description: String, $icon: String) {
  updateSystem(
    input: {title: $title, description: $description, iconId: $icon}
    where: {id: {eq: "system"}}
  ) {
    id
    title
    description
    iconId
    cardId
    createdAt
    updatedAt
    icon {
      id
      name
      mimeType
      createdAt
      updatedAt
    }
  }
}
    `;

export function useUpdateSystemMutation() {
  return Urql.useMutation<UpdateSystemMutation, UpdateSystemMutationVariables>(UpdateSystemDocument);
};
export const FindCategoryDocument = gql`
    query FindCategory($id: String!) {
  findFirstCategory(where: {id: {eq: $id}}) {
    id
    name
    createdAt
    updatedAt
  }
}
    `;

export function useFindCategoryQuery(options: Omit<Urql.UseQueryArgs<FindCategoryQueryVariables>, 'query'>) {
  return Urql.useQuery<FindCategoryQuery, FindCategoryQueryVariables>({ query: FindCategoryDocument, ...options });
};
export const FindCategoriesDocument = gql`
    query FindCategories {
  findManyCategory {
    id
    name
    createdAt
    updatedAt
  }
}
    `;

export function useFindCategoriesQuery(options?: Omit<Urql.UseQueryArgs<FindCategoriesQueryVariables>, 'query'>) {
  return Urql.useQuery<FindCategoriesQuery, FindCategoriesQueryVariables>({ query: FindCategoriesDocument, ...options });
};
export const CreateCategoryDocument = gql`
    mutation CreateCategory($name: String!) {
  createOneCategory(input: {name: $name}) {
    id
    name
    createdAt
    updatedAt
  }
}
    `;

export function useCreateCategoryMutation() {
  return Urql.useMutation<CreateCategoryMutation, CreateCategoryMutationVariables>(CreateCategoryDocument);
};
export const UpdateCategoryDocument = gql`
    mutation UpdateCategory($id: String!, $name: String!) {
  updateCategory(where: {id: {eq: $id}}, input: {name: $name}) {
    id
    name
    createdAt
    updatedAt
  }
}
    `;

export function useUpdateCategoryMutation() {
  return Urql.useMutation<UpdateCategoryMutation, UpdateCategoryMutationVariables>(UpdateCategoryDocument);
};
export const DeleteCategoryDocument = gql`
    mutation DeleteCategory($id: String!) {
  deleteCategory(where: {id: {eq: $id}}) {
    id
    name
    createdAt
    updatedAt
  }
}
    `;

export function useDeleteCategoryMutation() {
  return Urql.useMutation<DeleteCategoryMutation, DeleteCategoryMutationVariables>(DeleteCategoryDocument);
};
export const UploadSystemIconDocument = gql`
    mutation UploadSystemIcon($file: Upload!) {
  uploadSystemIcon(file: $file) {
    id
    name
    mimeType
    createdAt
    updatedAt
  }
}
    `;

export function useUploadSystemIconMutation() {
  return Urql.useMutation<UploadSystemIconMutation, UploadSystemIconMutationVariables>(UploadSystemIconDocument);
};
export const UploadPostIconDocument = gql`
    mutation UploadPostIcon($postId: String!, $file: Upload) {
  uploadPostIcon(postId: $postId, file: $file) {
    id
    name
    mimeType
    createdAt
    updatedAt
  }
}
    `;

export function useUploadPostIconMutation() {
  return Urql.useMutation<UploadPostIconMutation, UploadPostIconMutationVariables>(UploadPostIconDocument);
};
export const NormalizationPostFilesDocument = gql`
    mutation NormalizationPostFiles($postId: String!, $removeAll: Boolean) {
  normalizationPostFiles(postId: $postId, removeAll: $removeAll)
}
    `;

export function useNormalizationPostFilesMutation() {
  return Urql.useMutation<NormalizationPostFilesMutation, NormalizationPostFilesMutationVariables>(NormalizationPostFilesDocument);
};
export const RestoreDocument = gql`
    mutation Restore($file: Upload!) {
  restore(file: $file)
}
    `;

export function useRestoreMutation() {
  return Urql.useMutation<RestoreMutation, RestoreMutationVariables>(RestoreDocument);
};
export const BackupDocument = gql`
    mutation Backup {
  backup
}
    `;

export function useBackupMutation() {
  return Urql.useMutation<BackupMutation, BackupMutationVariables>(BackupDocument);
};
export const UpdateCorsDocument = gql`
    mutation UpdateCors($origin: [String!]) {
  bucket(cors: [{origin: $origin, method: ["GET"], maxAgeSeconds: 3600}]) {
    cors {
      origin
      method
      responseHeader
      maxAgeSeconds
    }
  }
}
    `;

export function useUpdateCorsMutation() {
  return Urql.useMutation<UpdateCorsMutation, UpdateCorsMutationVariables>(UpdateCorsDocument);
};
export const BucketDocument = gql`
    query Bucket {
  bucket {
    cors {
      origin
      method
      responseHeader
      maxAgeSeconds
    }
  }
}
    `;

export function useBucketQuery(options?: Omit<Urql.UseQueryArgs<BucketQueryVariables>, 'query'>) {
  return Urql.useQuery<BucketQuery, BucketQueryVariables>({ query: BucketDocument, ...options });
};
export const RestoreFilesDocument = gql`
    mutation RestoreFiles($files: [Upload!]!) {
  restoreFiles(files: $files) {
    id
    name
    mimeType
    createdAt
    updatedAt
  }
}
    `;

export function useRestoreFilesMutation() {
  return Urql.useMutation<RestoreFilesMutation, RestoreFilesMutationVariables>(RestoreFilesDocument);
};