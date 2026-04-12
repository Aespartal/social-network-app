import { Container } from 'inversify'
import { TYPES } from './di-types'
import { prisma } from './prisma'
import { PrismaClient } from '@/generated/prisma'
import { MemoryCacheService } from './cache.service'
import { InMemoryEventBus } from './events/in-memory-event-bus'
import { EventBus } from './events/event-bus.interface'

// --- POSTS ---
import { PrismaPostRepository } from '../modules/posts/infrastructure/repositories/prisma-post.repository'
import { PrismaPostQueryProvider } from '../modules/posts/infrastructure/services/prisma-post-query.service'
import { PrismaRecentSearchRepository } from '../modules/posts/infrastructure/repositories/prisma-recent-search.repository'
import { PostController } from '../modules/posts/infrastructure/controllers/post.controller'
import {
  CreatePostCommandHandler,
  DeletePostCommandHandler,
  UpdatePostCommandHandler,
  ToggleLikeCommandHandler,
  ToggleBookmarkCommandHandler,
  AddRecentSearchCommandHandler,
  DeleteRecentSearchHandler as DeleteRecentSearchCommandHandler,
  ClearRecentSearchesHandler as ClearRecentSearchesCommandHandler,
} from '../modules/posts/application/commands'
import {
  GetFeedHandler,
  GetFollowingFeedHandler,
  GetPostDetailHandler,
  GetPostRepliesHandler,
  GetTrendingPostsHandler,
  GetBookmarkedPostsHandler,
  GetLikedPostsHandler,
  GetPostsByTagHandler,
  GetPostsWithMediaHandler,
  GetUserPostsHandler,
  SearchPostsQueryHandler,
  GetRecentSearchesHandler,
} from '../modules/posts/application/queries'

// --- AUTH ---
import { PrismaAuthRepository } from '../modules/auth/infrastructure/repositories/prisma-auth.repository'
import { AuthController } from '../modules/auth/infrastructure/controllers/auth.controller'
import { TokenService } from '../modules/auth/infrastructure/services/token.service'
import { BcryptHashService } from '../modules/auth/infrastructure/services/bcrypt-hash.service'
import { HttpGoogleService } from '../modules/auth/infrastructure/services/http-google.service'
import { CloudinaryImageService } from '../modules/auth/infrastructure/services/cloudinary-image.service'
import {
  RegisterCommandHandler,
  LoginCommandHandler,
  GoogleLoginCommandHandler,
  RefreshTokenCommandHandler,
  LogoutCommandHandler,
} from '../modules/auth/application/commands'
import { GetMeHandler } from '../modules/auth/application/queries'

// --- USERS ---
import { PrismaUserRepository } from '../modules/users/infrastructure/repositories/prisma-user.repository'
import { PrismaUserQueryProvider } from '../modules/users/infrastructure/services/prisma-user-query.provider'
import { UserController } from '../modules/users/infrastructure/controllers/user.controller'
import {
  FollowUserHandler,
  UnfollowUserHandler,
} from '../modules/users/application/commands'
import {
  GetFollowersHandler,
  GetFollowingHandler,
  IsFollowingHandler,
} from '../modules/users/application/queries'

// --- NOTIFICATIONS ---
import { PrismaNotificationRepository } from '../modules/notifications/infrastructure/repositories/prisma-notification.repository'
import { PrismaNotificationQueryProvider } from '../modules/notifications/infrastructure/services/prisma-notification-query.service'
import { NotificationController } from '../modules/notifications/infrastructure/controllers/notification.controller'
import { MarkAsReadHandler } from '../modules/notifications/application/commands/mark-as-read/mark-as-read.handler'
import { GetNotificationsHandler } from '../modules/notifications/application/queries/get-notifications/get-notifications.handler'
import { NotificationService } from '../modules/notifications/application/services/notification.service'
import { NotificationListener } from '../modules/notifications/infrastructure/services/notification-listener'

const container = new Container()

// Core
container.bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(prisma)
container.bind(TYPES.CacheService).to(MemoryCacheService).inSingletonScope()
container.bind<EventBus>(TYPES.EventBus).to(InMemoryEventBus).inSingletonScope()
container
  .bind(TYPES.NotificationListener)
  .to(NotificationListener)
  .inSingletonScope()

// --- POSTS BINDINGS ---
container.bind(TYPES.PostRepository).to(PrismaPostRepository).inSingletonScope()
container
  .bind(TYPES.PostQueryProvider)
  .to(PrismaPostQueryProvider)
  .inSingletonScope()
container
  .bind(TYPES.RecentSearchRepository)
  .to(PrismaRecentSearchRepository)
  .inSingletonScope()
container.bind(TYPES.CreatePostCommandHandler).to(CreatePostCommandHandler)
container.bind(TYPES.DeletePostCommandHandler).to(DeletePostCommandHandler)
container.bind(TYPES.UpdatePostCommandHandler).to(UpdatePostCommandHandler)
container.bind(TYPES.ToggleLikeCommandHandler).to(ToggleLikeCommandHandler)
container
  .bind(TYPES.ToggleBookmarkCommandHandler)
  .to(ToggleBookmarkCommandHandler)
container
  .bind(TYPES.AddRecentSearchCommandHandler)
  .to(AddRecentSearchCommandHandler)
container.bind(TYPES.GetRecentSearchesHandler).to(GetRecentSearchesHandler)
container
  .bind(TYPES.DeleteRecentSearchHandler)
  .to(DeleteRecentSearchCommandHandler)
container
  .bind(TYPES.ClearRecentSearchesHandler)
  .to(ClearRecentSearchesCommandHandler)
container.bind(TYPES.GetFeedHandler).to(GetFeedHandler)
container.bind(TYPES.GetFollowingFeedHandler).to(GetFollowingFeedHandler)
container.bind(TYPES.GetPostDetailHandler).to(GetPostDetailHandler)
container.bind(TYPES.GetPostRepliesHandler).to(GetPostRepliesHandler)
container.bind(TYPES.GetTrendingPostsHandler).to(GetTrendingPostsHandler)
container.bind(TYPES.GetBookmarkedPostsHandler).to(GetBookmarkedPostsHandler)
container.bind(TYPES.GetLikedPostsHandler).to(GetLikedPostsHandler)
container.bind(TYPES.GetPostsByTagHandler).to(GetPostsByTagHandler)
container.bind(TYPES.GetPostsWithMediaHandler).to(GetPostsWithMediaHandler)
container.bind(TYPES.GetUserPostsHandler).to(GetUserPostsHandler)
container.bind(TYPES.SearchPostsHandler).to(SearchPostsQueryHandler)
container.bind<PostController>(TYPES.PostController).to(PostController)

// --- AUTH BINDINGS ---
container.bind(TYPES.AuthRepository).to(PrismaAuthRepository).inSingletonScope()
container.bind(TYPES.TokenService).to(TokenService).inSingletonScope()
container.bind(TYPES.HashService).to(BcryptHashService).inSingletonScope()
container.bind(TYPES.GoogleService).to(HttpGoogleService).inSingletonScope()
container.bind(TYPES.ImageService).to(CloudinaryImageService).inSingletonScope()
container.bind(TYPES.RegisterCommandHandler).to(RegisterCommandHandler)
container.bind(TYPES.LoginCommandHandler).to(LoginCommandHandler)
container.bind(TYPES.GoogleLoginCommandHandler).to(GoogleLoginCommandHandler)
container.bind(TYPES.RefreshTokenCommandHandler).to(RefreshTokenCommandHandler)
container.bind(TYPES.LogoutCommandHandler).to(LogoutCommandHandler)
container.bind(TYPES.GetMeHandler).to(GetMeHandler)
container.bind<AuthController>(TYPES.AuthController).to(AuthController)

// --- USERS BINDINGS ---
container.bind(TYPES.UserRepository).to(PrismaUserRepository).inSingletonScope()
container
  .bind(TYPES.UserQueryProvider)
  .to(PrismaUserQueryProvider)
  .inSingletonScope()
container.bind(TYPES.FollowUserHandler).to(FollowUserHandler)
container.bind(TYPES.UnfollowUserHandler).to(UnfollowUserHandler)
container.bind(TYPES.GetFollowersHandler).to(GetFollowersHandler)
container.bind(TYPES.GetFollowingHandler).to(GetFollowingHandler)
container.bind(TYPES.IsFollowingHandler).to(IsFollowingHandler)
container.bind<UserController>(TYPES.UserController).to(UserController)

// --- NOTIFICATIONS BINDINGS ---
container
  .bind(TYPES.NotificationRepository)
  .to(PrismaNotificationRepository)
  .inSingletonScope()
container
  .bind(TYPES.NotificationQueryProvider)
  .to(PrismaNotificationQueryProvider)
  .inSingletonScope()
container.bind(TYPES.GetNotificationsHandler).to(GetNotificationsHandler)
container.bind(TYPES.MarkAsReadHandler).to(MarkAsReadHandler)
container
  .bind(TYPES.NotificationService)
  .to(NotificationService)
  .inSingletonScope()
container
  .bind<NotificationController>(TYPES.NotificationController)
  .to(NotificationController)

export { container }
