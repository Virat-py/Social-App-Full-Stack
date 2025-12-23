"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

type Post = {
  id: number;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
};

export function PostsLayout() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selected, setSelected] = useState<Post | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [showDeleteError, setShowDeleteError] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // ================= FETCH POSTS =================
  useEffect(() => {
    const token = localStorage.getItem("token");
    // 🔴 No token → go to login
    if (!token) {
      router.replace("/login");
      return;
    }

    // decode user_id from JWT
    const payload = JSON.parse(atob(token.split(".")[1]));
    setCurrentUser(payload.sub);

    fetch("http://127.0.0.1:8000/posts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          router.replace("/login");
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then((data: Post[]) => {
        const sorted = [...data].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setPosts(sorted);
        if (sorted.length > 0) {
          setSelected(sorted[0]);
        }
      })
      .catch(console.error);
  }, []);

  // ================= CREATE POST =================
  const handleCreatePost = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("http://127.0.0.1:8000/create_post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });

    const newPost = await res.json();

    setPosts((prev) => [newPost, ...prev]);
    setSelected(newPost);

    setOpen(false);
    setTitle("");
    setContent("");
  };

  // ================= DELETE POST =================
  const handleDeletePost = async () => {
    if (!selected || !currentUser) return;

    if (selected.user_id !== currentUser) {
      setShowDeleteError(true);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch(`http://127.0.0.1:8000/delete_post/${selected.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setPosts((prev) => prev.filter((p) => p.id !== selected.id));
    setSelected((prev) => posts.find((p) => p.id !== prev?.id) ?? null);
  };

  // ================= UI =================
  return (
    <div className="mx-auto max-w-6xl h-screen p-6">
      <div className="grid h-full grid-cols-3 gap-6">
        {/* LEFT PANEL */}
        <Card className="col-span-1 bg-muted/30 shadow-sm">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-indigo-600">Posts</CardTitle>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="icon" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Post</DialogTitle>
                </DialogHeader>

                <Input
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <Textarea
                  placeholder="Content"
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />

                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreatePost}>Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>

          <Separator />

          <ScrollArea className="h-[75vh] p-2">
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => setSelected(post)}
                className={`p-3 rounded-md cursor-pointer ${
                  selected?.id === post.id
                    ? "bg-white border border-indigo-200"
                    : "hover:bg-white/60"
                }`}
              >
                <p className="font-medium">{post.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {post.content}
                </p>
              </div>
            ))}
          </ScrollArea>
        </Card>

        {/* RIGHT PANEL */}
        {selected && (
          <Card className="col-span-2 shadow-md">
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle className="text-3xl text-indigo-700">
                  {selected.title}
                </CardTitle>

                <Button
                  size="icon"
                  variant="ghost"
                  className="text-red-600 hover:bg-red-100"
                  onClick={handleDeletePost}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                by {selected.user_id} | {selected.created_at}
              </p>
            </CardHeader>

            <Separator />

            <CardContent>
              <p className="whitespace-pre-wrap">{selected.content}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* DELETE ERROR */}
      <Dialog open={showDeleteError} onOpenChange={setShowDeleteError}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">
              Action not allowed
            </DialogTitle>
          </DialogHeader>

          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Not authorized</AlertTitle>
            <AlertDescription>
              You&apos;re not authorized to delete this post.
            </AlertDescription>
          </Alert>
        </DialogContent>
      </Dialog>
    </div>
  );
}
