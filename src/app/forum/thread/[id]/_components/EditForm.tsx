// src/app/forum/thread/[id]/_components/EditForm.tsx
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import TiptapEditor, { type TiptapEditorRef } from "@/components/TiptapEditor";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThreadPost } from "@/types/entities/threadPost";
import { getPost, savePost } from "@/services/post";

interface PostForm {
  title: string;
  content: string;
}

interface EditFormProps {
  post?: ThreadPost; // Pass the post object instead of fetching it
  onPostSaved?: () => void;
}

export default function EditForm({ post, onPostSaved }: EditFormProps) {
  const { id: threadId } = useParams(); // Get thread ID from URL
  const postId = post?.id;

  const editorRef = useRef<TiptapEditorRef>(null);
  const [isLoading, setIsLoading] = useState(!!post); // Show loading only when editing
  const { control, reset, watch, handleSubmit } = useForm<PostForm>();

  const getWordCount = useCallback(
    () => editorRef.current?.getInstance()?.storage.characterCount.words() ?? 0,
    [editorRef.current]
  );

  useEffect(() => {
    if (post) {
      reset(post);
      setIsLoading(false);
    }
  }, [post]);

  useEffect(() => {
    const subscription = watch((values, { type }) => {
      if (type === "change") {
        savePost({ ...values, wordCount: getWordCount() });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async (data: PostForm) => {
    setIsLoading(true);
    await savePost({ ...data, threadId, postId, wordCount: getWordCount() });
    setIsLoading(false);
    onPostSaved?.(); // Notify parent component
  };

  if (isLoading) return;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div>
        <label className="inline-block font-medium dark:text-white mb-2">
          Content
        </label>
        <Controller
          control={control}
          name="content"
          render={({ field }) => (
            <TiptapEditor
              ref={editorRef}
              ssr={true}
              output="html"
              placeholder={{
                paragraph: "Type your content here...",
                imageCaption: "Type caption for image (optional)",
              }}
              contentMinHeight={256}
              contentMaxHeight={640}
              onContentChange={field.onChange}
              initialContent={field.value}
            />
          )}
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : postId ? "Update Post" : "Create Post"}
      </Button>
    </form>
  );
}
