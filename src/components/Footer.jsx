export function Footer() {
    return (
      <footer className="border-t border-gray-200 bg-white py-6 px-6">
        <div className="mx-auto flex max-w-7xl flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">
              © 2025 DeployHub. All rights reserved.
            </p>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
              Terms
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
              Privacy
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
              Contact
            </a>
          </div>
        </div>
      </footer>
    );
  }