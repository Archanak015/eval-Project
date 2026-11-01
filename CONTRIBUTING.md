# Contributing to UniConnect

Thank you for your interest in contributing to **UniConnect - Smart Campus Management System**!

## Development Guidelines

1. **Branching**:
   - Create feature branches from `main` using `feature/your-feature-name` or `bugfix/issue-description`.
2. **Commit Conventions**:
   - `feat:` for new capabilities
   - `fix:` for bug fixes
   - `refactor:` for code restructuring without feature change
   - `perf:` for performance enhancements
   - `docs:` for documentation updates
3. **Coding Standards**:
   - Backend: Keep controllers slim, wrap with `asyncHandler`, return standard `ApiResponse`.
   - Frontend: Ensure responsive layouts using Tailwind CSS, provide loading skeletons and empty states.
