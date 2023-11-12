"use client";
import Button from "components/Button";
import { User } from "next-auth";
import { useRouter } from "next/navigation";
import { useRef } from "react";

interface ISignUpModal {
  onClose: () => void;
  activeSign?: { type: string; date: string };
  user: User;
}

const SignUpModal = ({ onClose, activeSign, user }: ISignUpModal) => {
  const { refresh } = useRouter();
  const commentRef = useRef<HTMLInputElement>(null);

  const submitSign = async () => {
    await fetch("/api", {
      method: "POST",
      body: JSON.stringify({
        id: user.id,
        type: activeSign?.type,
        date: activeSign?.date,
        comment: commentRef.current?.value,
      }),
    }).then((res) => {
      if (res.ok) {
        refresh();
        onClose();
      }
    });
  };

  return (
    <div>
      <h4 className="text-xl">
        {activeSign?.date}
        {activeSign?.type === "night" ? " Kväll" : " Lunch"}
      </h4>
      <div className="flex flex-col">
        <label className="mt-1">Kommentar</label>
        <input
          ref={commentRef}
          type="text"
          placeholder="T.ex tid eller enbart inhouse"
          className="min-h-12 rounded-md border-2 border-primary bg-transparent p-2 transition-shadow  focus:outline-none"
        />
        <div className="mt-4 flex flex-row gap-4">
          <Button className="inline-flex flex-1" onClick={() => submitSign()}>
            Svara
          </Button>
          <Button
            variant="secondary"
            className="inline-flex flex-1"
            onClick={() => onClose()}
          >
            Avbryt
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignUpModal;
