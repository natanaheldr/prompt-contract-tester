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

  it('has a Load Example button', () => {
    renderWithProvider();
    expect(screen.getByText('Load Example')).toBeInTheDocument();
  });

  it('detects placeholders in the default prompt and renders input fields', () => {
    renderWithProvider();
    expect(screen.getByText('{{topic}}')).toBeInTheDocument();
    expect(screen.getByText('{{language}}')).toBeInTheDocument();
  });

  it('allows typing into placeholder fields', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    const inputs = screen.getAllByPlaceholderText(/value for/i);
    expect(inputs.length).toBeGreaterThan(0);

    await user.type(inputs[0], 'React Hooks');
    expect(inputs[0]).toHaveValue('React Hooks');
  });

  it('shows Load Example button and it modifies prompt', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    const textarea = screen.getByPlaceholderText(
      /write your prompt/i,
    ) as HTMLTextAreaElement;
    const original = textarea.value;

    await user.click(screen.getByText('Load Example'));
    expect(textarea.value).toBe(original);
  });
});
