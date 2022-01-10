import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BlogForm from '../components/BlogForm';

describe('<BlogForm />', () => {
  let component;
  let mockHandler;

  beforeEach(() => {
    mockHandler = jest.fn();
    component = render(<BlogForm addBlog={mockHandler} />);
  });

  test('the event handler of the form is called with the right details', () => {
    const form = component.container.querySelector('form');
    const inputTitle = component.container.querySelector('#title');
    const inputAuthor = component.container.querySelector('#author');
    const inputUrl = component.container.querySelector('#url');

    fireEvent.change(inputTitle, {
      target: { value: 'A Dissection of The Search by NF' },
    });

    fireEvent.change(inputAuthor, {
      target: { value: 'Temple Olowonigba' },
    });
    fireEvent.change(inputUrl, {
      target: { value: 'http://fakeurl30014.com' },
    });

    fireEvent.submit(form);

    expect(mockHandler.mock.calls).toHaveLength(1);
    expect(mockHandler.mock.calls[0][0]).toEqual({
      title: 'A Dissection of The Search by NF',
      author: 'Temple Olowonigba',
      url: 'http://fakeurl30014.com',
    });
  });
});
