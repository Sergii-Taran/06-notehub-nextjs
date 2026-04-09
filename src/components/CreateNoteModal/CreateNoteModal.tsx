'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api/notes';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

import css from './CreateNoteModal.module.css';

interface Props {
  onClose: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string().min(3).max(50).required('Required'),
  content: Yup.string().max(500),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
    .required('Required'),
});

export default function CreateNoteModal({ onClose }: Props) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      toast.success('Note created');

      queryClient.invalidateQueries({
        queryKey: ['notes'],
        exact: false,
      });

      onClose();
    },
    onError: () => {
      toast.error('Failed to create note');
    },
  });

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return createPortal(
    <div className={css.backdrop} onClick={onClose}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <h2>Create Note</h2>

        <Formik
          initialValues={{
            title: '',
            content: '',
            tag: 'Todo',
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            mutation.mutate(values);
          }}
        >
          {({ isSubmitting }) => (
            <Form className={css.form}>
              <div className={css.formGroup}>
                <label htmlFor="title">Title</label>
                <Field name="title" className={css.input} />
                <ErrorMessage
                  name="title"
                  component="span"
                  className={css.error}
                />
              </div>

              <div className={css.formGroup}>
                <label htmlFor="content">Content</label>
                <Field
                  as="textarea"
                  name="content"
                  rows={6}
                  className={css.textarea}
                />
                <ErrorMessage
                  name="content"
                  component="span"
                  className={css.error}
                />
              </div>

              <div className={css.formGroup}>
                <label htmlFor="tag">Tag</label>
                <Field as="select" name="tag" className={css.select}>
                  <option value="Todo">Todo</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Shopping">Shopping</option>
                </Field>
                <ErrorMessage
                  name="tag"
                  component="span"
                  className={css.error}
                />
              </div>

              <div className={css.actions}>
                <button
                  type="button"
                  onClick={onClose}
                  className={css.cancelButton}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || mutation.isPending}
                  className={css.submitButton}
                >
                  {mutation.isPending ? 'Creating...' : 'Create note'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>,
    document.body
  );
}
