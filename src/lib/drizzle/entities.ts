import { z } from "zod";

// Primitive type schemas
const UUIDSchema = z.string().uuid();
const TimestampSchema = z.number().int().positive();
const URLSchema = z.string().url();
const SlugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

/**=======================================================================================================================
 *                                                    Tag Schema
 *=======================================================================================================================**/
// Value Object schemas
const TagSchema = z.object({
    id: UUIDSchema,
    name: z.string().min(1).max(50),
    slug: SlugSchema,
});

/**=======================================================================================================================
 *                                                    Media Schema
 *=======================================================================================================================**/
const MediaMetadataSchema = z.object({
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
    duration: z.number().positive().optional(),
    format: z.string(),
    size: z.number().positive(),
});

// Media schemas
const BaseMediaSchema = z.object({
    id: UUIDSchema,
    url: URLSchema,
    altText: z.string(),
    metadata: MediaMetadataSchema,
    uploadedAt: TimestampSchema,
});

const PhotoSchema = BaseMediaSchema.extend({
    type: z.literal("photo"),
});

const VideoSchema = BaseMediaSchema.extend({
    type: z.literal("video"),
    thumbnailUrl: URLSchema,
});

const GIFSchema = BaseMediaSchema.extend({
    type: z.literal("gif"),
});

const MediaSchema = z.discriminatedUnion("type", [PhotoSchema, VideoSchema, GIFSchema]);

/**=======================================================================================================================
 *                                                    User Schema
 *=======================================================================================================================**/
// User schemas
const UserBaseSchema = z.object({
    id: UUIDSchema,
    email: z.string().email(),
    name: z.string().min(2).max(100),
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
});

const WriterSchema = UserBaseSchema.extend({
    role: z.literal("writer"),
    bio: z.string().max(500),
    publishedPosts: z.number().int().nonnegative(),
});

const VisitorSchema = UserBaseSchema.extend({
    role: z.literal("visitor"),
    lastVisit: TimestampSchema,
});

const SupervisorSchema = UserBaseSchema.extend({
    role: z.literal("supervisor"),
    managedSections: z.array(z.string()),
});

const UserSchema = z.discriminatedUnion("role", [WriterSchema, VisitorSchema, SupervisorSchema]);

/**=======================================================================================================================
 *                                                    Blog Schema
 * => depend on these schemas:
 * =>   - Tag
 * =>   - Media
 * =>   - Writer(User)
 *=======================================================================================================================**/

// Blog schemas
const BlogPostSchema = z.object({
    id: UUIDSchema,
    title: z.string().min(1).max(200),
    slug: SlugSchema,
    content: z.string().min(1),
    excerpt: z.string().max(300),
    author: WriterSchema,
    tags: z.array(TagSchema),
    media: z.array(MediaSchema),
    status: z.enum(["draft", "published", "archived"]),
    publishedAt: TimestampSchema.optional(),
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
    metadata: z.object({
        readingTime: z.number().positive(),
        viewCount: z.number().int().nonnegative(),
        likeCount: z.number().int().nonnegative(),
    }),
});

// Domain Event schemas
const BlogPostCreatedSchema = z.object({
    type: z.literal("BlogPostCreated"),
    payload: z.object({
        postId: UUIDSchema,
        authorId: UUIDSchema,
        timestamp: TimestampSchema,
    }),
});

const BlogPostPublishedSchema = z.object({
    type: z.literal("BlogPostPublished"),
    payload: z.object({
        postId: UUIDSchema,
        publishedAt: TimestampSchema,
    }),
});

const BlogDomainEventSchema = z.discriminatedUnion("type", [BlogPostCreatedSchema, BlogPostPublishedSchema]);

/**=======================================================================================================================
 *                                                    Exports
 *=======================================================================================================================**/
// Infer TypeScript types from schemas
type Tag = z.infer<typeof TagSchema>;
type MediaMetadata = z.infer<typeof MediaMetadataSchema>;
type Media = z.infer<typeof MediaSchema>;
type User = z.infer<typeof UserSchema>;
type Writer = z.infer<typeof WriterSchema>;
type BlogPost = z.infer<typeof BlogPostSchema>;
type BlogDomainEvent = z.infer<typeof BlogDomainEventSchema>;

// Export everything
export { TagSchema, MediaMetadataSchema, MediaSchema, UserSchema, WriterSchema, BlogPostSchema, BlogDomainEventSchema };

export type { Tag, MediaMetadata, Media, User, Writer, BlogPost, BlogDomainEvent };
