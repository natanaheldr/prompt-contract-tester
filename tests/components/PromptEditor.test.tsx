import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PromptEditor from '../../src/components/PromptEditor.tsx';
import { AppProvider } from '../../src/context/AppContext.tsx';

function renderWithProvider() {
  return render(
    <AppProvider>
      <PromptEditor />
    </AppProvider>,
  );
}

describe('PromptEditor', () => {
  it('renders the prompt textarea', () => {
    renderWithProvider();
    const textarea = screen.getByPlaceholderText(/write your prompt/i);
    expect(textarea).toBeInTheDocument();
  });

  it('has an Example button', () => {
    renderWithProvider();
    expect(screen.getByText('Example')).toBeInTheDocument();
  });

  it('detects placeholders in the default prompt and renders input fields', () => {
    renderWithProvider();
    expect(screen.getByText('{{topic}}')).toBeInTheDocument();
    expect(screen.getByText('{{language}}')).toBeInTheDocument();
  });

  it('allows typing into placeholder fields', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    const topicInput = screen.getByPlaceholderText('topic');
    expect(topicInput).toBeInTheDocument();

    await user.type(topicInput, 'React Hooks');
    expect(topicInput).toHaveValue('React Hooks');
  });

  it('clicking Example sets the example prompt', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByText('Example'));

    const textarea = screen.getByPlaceholderText(/write your prompt/i) as HTMLTextAreaElement;
    expect(textarea.value).toContain('{{topic}}');
  });
});
