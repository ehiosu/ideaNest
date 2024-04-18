import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";
import { Check, Search, Trash, Undo } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { ConfirmModal } from "./ConfirmationDialog";

export const Trashbox = () => {
  const router = useRouter();
  const params = useParams();
  const ideas = useQuery(api.Idea.getTrash, {});
  const restore = useMutation(api.Idea.restoreIdea);
  const remove = useMutation(api.Idea.removeIdea);

  const [query, setQuery] = useState("");
  const [selectedTags, setSlecetedTags] = useState<Id<"Tag">[]>();
  const filteredSearch = ideas?.filter((taaggedIdea) =>
    taaggedIdea.idea.title.toLowerCase().includes(query.toLowerCase())
  );
  console.log(filteredSearch);
  const tagFilteredDocuments = filteredSearch?.filter(
    (filteredTaggedSearch) => {
      return selectedTags?.some((tag) =>
        filteredTaggedSearch.tags.some((tagObject) =>
          tagObject._id.includes(tag)
        )
      );
    }
  );

  const handleClick = (id: string) => {
    router.push(`/documents/${id}`);
  };
  const tryRestore = (
    event: React.MouseEvent< HTMLDivElement, MouseEvent>,
    id: Id<"Idea">
  ) => {
    event.stopPropagation();
    const restorePromise = restore({ id: id });
    toast.promise(restorePromise, {
      loading: "Trying to restore Idea...",
      success: "Idea Restored!",
      error: "Error restoring Idea.",
    });
  };
  const tryRemove = (id: Id<"Idea">) => {
    const removePromise = remove({ id: id });
    toast.promise(removePromise, {
      loading: "Trying to remove Idea...",
      success: "Idea Removed!",
      error: "Error removing Idea.",
    });
    if (params.id === id) {
      router.push("/documents");
    }
  };
  if (ideas === undefined) {
    return (
      <main className="w-full h-full flex flex-row items-center justify-center">
        <div className="loader w-8"></div>
      </main>
    );
  }
  return (
    <div>
      <div className="flex items-center space-x-1 p-2 border-2 rounded-xl px-4">
        <Search className="h-4 w-4 shrink" />
        <Input
          className="focus-visible:ring-transparent h-6 border-transparent shadow-none"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />
      </div>
      {filteredSearch?.map((search) => (
        <div className="flex items-center space-x-2  p-2 hover:bg-primary/10 rounded-md my-2 group">
          {<p>{search.idea.title}</p>}
          <div className="flex-1 flex items-center justify-end space-x-2">
            <div
              onClick={(e) => {
                tryRestore(e, search.idea._id);
              }}
            >
              <Undo className="h-6 w-6 shrink hover:bg-primary/20 rounded-md hover:text-white transition cursor-pointer p-1 opacity-0 group-hover:opacity-100" />
            </div>
            <ConfirmModal onConfirm={()=>tryRemove(search.idea._id)}>
            <div role="button">
              <Trash className="h-6 w-6 rounded-md shrink hover:bg-primary/20 cursor-pointer p-1 hover:text-white transition opacity-0 group-hover:opacity-100    " />
            </div>
            </ConfirmModal>
          </div>
        </div>
      ))}
    </div>
  );
};
