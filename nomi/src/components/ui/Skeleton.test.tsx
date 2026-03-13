import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { 
  Skeleton, 
  SkeletonCard, 
  SkeletonStat, 
  SkeletonProgress, 
  SkeletonList,
  SkeletonTableRow 
} from './Skeleton';

describe('Skeleton Components', () => {
  describe('Skeleton', () => {
    it('should render with default props', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.querySelector('div');
      
      expect(skeleton).toBeInTheDocument();
    });

    it('should apply custom width and height', () => {
      const { container } = render(<Skeleton width={200} height={40} />);
      const skeleton = container.querySelector('div');
      
      expect(skeleton).toHaveStyle({ width: '200px', height: '40px' });
    });

    it('should render text variant correctly', () => {
      const { container } = render(<Skeleton variant="text" />);
      const skeleton = container.querySelector('div');
      
      expect(skeleton).toHaveStyle({ height: '1em' });
    });

    it('should render circular variant correctly', () => {
      const { container } = render(<Skeleton variant="circular" width={50} height={50} />);
      const skeleton = container.querySelector('div');
      
      expect(skeleton).toHaveStyle({ borderRadius: '50%' });
    });

    it('should apply pulse animation by default', () => {
      const { container } = render(<Skeleton animation="pulse" />);
      const skeleton = container.querySelector('div');
      
      expect(skeleton).toHaveClass('skeleton-pulse');
    });

    it('should apply wave animation', () => {
      const { container } = render(<Skeleton animation="wave" />);
      const skeleton = container.querySelector('div');
      
      expect(skeleton).toHaveClass('skeleton-wave');
    });

    it('should not apply animation when set to none', () => {
      const { container } = render(<Skeleton animation="none" />);
      const skeleton = container.querySelector('div');
      
      expect(skeleton).not.toHaveClass('skeleton-pulse');
      expect(skeleton).not.toHaveClass('skeleton-wave');
    });
  });

  describe('SkeletonCard', () => {
    it('should render card skeleton structure', () => {
      const { container } = render(<SkeletonCard />);
      const card = container.querySelector('.card');
      
      expect(card).toBeInTheDocument();
      
      // Should have multiple skeleton elements
      const skeletons = container.querySelectorAll('div > div');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('SkeletonStat', () => {
    it('should render stat skeleton structure', () => {
      const { container } = render(<SkeletonStat />);
      
      // Should have 2 skeleton elements (number and label)
      const skeletons = container.querySelectorAll('div > div');
      expect(skeletons.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('SkeletonProgress', () => {
    it('should render progress skeleton with circular and text elements', () => {
      const { container } = render(<SkeletonProgress />);
      
      const skeletons = container.querySelectorAll('div');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('SkeletonList', () => {
    it('should render default number of list items', () => {
      const { container } = render(<SkeletonList />);
      
      // Default is 3 items
      const items = container.querySelectorAll('div > div > div');
      expect(items.length).toBeGreaterThanOrEqual(3);
    });

    it('should render custom number of list items', () => {
      const { container } = render(<SkeletonList count={5} />);
      
      // Should render 5 items
      const items = container.querySelectorAll('div > div');
      expect(items.length).toBe(5);
    });
  });

  describe('SkeletonTableRow', () => {
    it('should render with default number of columns', () => {
      const { container } = render(<SkeletonTableRow />);
      
      // Default is 4 columns
      const columns = container.querySelectorAll('div > div');
      expect(columns.length).toBe(4);
    });

    it('should render custom number of columns', () => {
      const { container } = render(<SkeletonTableRow columns={6} />);
      
      const columns = container.querySelectorAll('div > div');
      expect(columns.length).toBe(6);
    });
  });
});
