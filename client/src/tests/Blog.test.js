import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Blog from '../components/Blog';

describe('<Blog />', () => {
  let component;
  let mockHandler;

  beforeEach(() => {
    const blog = {
      title: 'Introduction to Next.js 2022',
      author: 'Catalin Pit',
      url: 'http://fake-url2035.com',
      likes: '108',
      user: '61983ad0d3e4315284240f1f',
    };

    mockHandler = jest.fn();

    component = render(<Blog blog={blog} increaseLikes={mockHandler} />);
  });

  test('on initial render only the title and author are in view', () => {
    expect(component.container).toHaveTextContent(
      'Introduction to Next.js 2022'
    );
    expect(component.container).toHaveTextContent('Catalin Pit');

    expect(component.container.querySelector('.blog__details')).toHaveStyle(
      'display: none'
    );
  });

  test('after the show button is clicked, other details of the blog come into view', () => {
    const button = component.getByText('show');
    fireEvent.click(button);

    expect(component.container.querySelector('.blog__details')).not.toHaveStyle(
      'display: none'
    );
  });

  test('the event handler passed to the like button is called appropriately', () => {
    const button = component.getByText('like');
    fireEvent.click(button);
    fireEvent.click(button);
    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});
