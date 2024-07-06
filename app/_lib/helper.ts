import { FieldError, UseFormSetError } from "react-hook-form";
import { NewBoardFormType, NewTaskFormType } from "./type";
import { SignJWT, jwtVerify } from "jose";

type columnFormProp = { name: string };

export const getErrorMessage = (error: unknown): string => {
  let message: string;

  if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === "object" && "message" in error) {
    message = String(error.message);
  } else if (typeof error === "string") {
    message = error;
  } else {
    message = "Something went wrong";
  }

  return message;
};

export function validateColumns(
  boardColumns: columnFormProp[],
  newColumns: columnFormProp[],
  setError: UseFormSetError<NewBoardFormType>,
) {
  const allColumns = [...boardColumns, ...newColumns];
  const columnNames = allColumns.map((column) => column.name.trim());
  const nameSet = new Set();

  for (let i = 0; i < columnNames.length; i++) {
    if (nameSet.has(columnNames[i])) {
      const adjustedIndex = i - boardColumns.length;
      if (adjustedIndex >= 0) {
        // @ts-ignore
        setError(`task-${adjustedIndex}`, {
          type: "manual",
          message: "Duplicate column names are not allowed",
        });
      }
      return false;
    }
    nameSet.add(columnNames[i]);
  }

  return true;
}

export function validateSubtasks(
  subtasks: { title: string; isCompleted: boolean }[],
  setError: UseFormSetError<NewTaskFormType>,
) {
  const subtaskTitles = subtasks.map((subtask) => subtask.title.trim());
  const titleSet = new Set();

  for (let i = 0; i < subtaskTitles.length; i++) {
    if (titleSet.has(subtaskTitles[i])) {
      // @ts-ignore
      setError(`task-${i}`, {
        type: "manual",
        message: "Duplicate subtask titles are not allowed",
      });
      return false;
    }
    titleSet.add(subtaskTitles[i]);
  }

  return true;
}

export function validateBoardName(
  newBoardName: string,
  currentBoardId: string,
  existingBoards: { id: string; name: string }[],
  setError: UseFormSetError<any>,
): boolean {
  const normalizedNewName = newBoardName.toLowerCase();

  for (const board of existingBoards) {
    if (
      board.name.toLowerCase() === normalizedNewName &&
      board.id !== currentBoardId
    ) {
      setError("name", {
        type: "manual",
        message: "Board name already exists",
      } as FieldError);
      return false;
    }
  }

  return true;
}

const key = new TextEncoder().encode(process.env.JWT_SECRET);

export async function encrypt(payload: any) {
  const expirationTime = new Date();
  expirationTime.setHours(expirationTime.getHours() + 24);

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(key);
}

export async function decrypt(input: string) {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}
