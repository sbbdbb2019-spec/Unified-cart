# Unified Cart POC (v2)

This is a static proof-of-concept meant to demonstrate the "unified cart" idea:
- Bundle items from multiple retailers into a single cart
- Simulate splitting orders per-store during checkout
- Shareable cart links to reproduce the same cart elsewhere

To deploy:
1. Create a new GitHub repository (public).
2. Upload these files into the repo root.
3. In GitHub repo Settings -> Pages, choose branch main and folder root to enable GitHub Pages.
4. Your site will be hosted at https://<username>.github.io/<repo>/

This is frontend-only; for production you'll want a backend for retailer APIs and order placement.
