"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Photos } from "@/contexts/RegisterContext";
import { useRegister } from "@/hooks/useRegister";

import { Banner } from "@/components/Banner";
import { FileUpload } from "@/components/FileUpload";
import { Toast } from "@/components/Toast";
import { Actions } from "@/patterns/Actions";

import { uploadFilesComponents } from "@/constants/uploadFiles";

export default function Foto() {
  const { photos } = useRegister();

  const [toastActive, setToastActive] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [validationClicked, setValidationClicked] = useState(false);

  const router = useRouter();

  function handleToast() {
    setToastActive(false);
    setTimeout(() => setToastActive(true), 100);
  }

  function areAllPhotosFilled(photos: Photos): boolean {
    const isReadyToSave = Object.values(photos).every(
      (photo) => photo.status === "valid",
    );

    setToastMessage(
      "Certifique-se de que todas as fotos estejam anexadas e válidas.",
    );
    handleToast();

    return isReadyToSave;
  }

  function handleBikePhotos() {
    setValidationClicked(true);

    const isAllPhotosFilled = areAllPhotosFilled(photos);

    if (isAllPhotosFilled) router.push("/registro");
  }

  return (
    <>
      <div className="flex flex-col gap-1">
        <Banner
          title="Envie as fotos da bike"
          text="Tire as fotos da sua bike para nossa IA analisá-las."
        />

        <span className="text-sm font-semibold text-red">
          Lembre-se de tirar a foto da sua bike em um fundo neutro para
          facilitar a validação.
        </span>
      </div>

      <div className="flex flex-col gap-6">
        {uploadFilesComponents.map(({ label, id }) => {
          return (
            <div className="space-y-1" key={id}>
              <h2 className="text-lg font-medium">{label}</h2>

              <FileUpload
                category={id as keyof Photos}
                alert={
                  validationClicked &&
                  (photos[id as keyof Photos].status === "waiting" ||
                    photos[id as keyof Photos].status === "invalid")
                }
              />
            </div>
          );
        })}
      </div>

      <div className="right-1/5 -translate-x-1/5 fixed top-0 pt-4 md:right-0">
        <Toast
          open={toastActive}
          onOpenChange={() => setToastActive(!toastActive)}
          alert={toastMessage}
        />
      </div>

      <div className="grid gap-4 xs:grid-cols-2">
        <Actions onStepCompletion={handleBikePhotos} />
      </div>
    </>
  );
}
