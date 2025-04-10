"""
Google Books API service module.
Provides functionality to fetch book data from Google Books API.
"""

import requests
import os

# Default API configuration
DEFAULT_API_URL = "https://www.googleapis.com/books/v1/volumes"
DEFAULT_API_KEY = os.environ.get("GOOGLE_BOOKS_API_KEY", "")


def fetch_book_data(isbn, api_url=None, api_key=None):
    """
    Fetch book data from Google Books API using a two-step process.

    First performs an ISBN search to get the volume ID, then makes a
    second request to get detailed information about the book.

    Args:
        isbn (str): The ISBN of the book to search for
        api_url (str, optional): Google Books API URL. Defaults to environment variable or hardcoded value.
        api_key (str, optional): Google Books API key. Defaults to environment variable or empty string.

    Returns:
        dict: Detailed book information from Google Books API or empty dict if not found
    """
    # Use provided values or defaults
    api_url = api_url or DEFAULT_API_URL
    api_key = api_key or DEFAULT_API_KEY

    # Step 1: Search by ISBN to get the volume ID
    search_params = {
        "q": f"isbn:{isbn}",
    }

    # Only add API key if it's available
    if api_key:
        search_params["key"] = api_key

    try:
        search_response = requests.get(api_url, params=search_params)
        search_response.raise_for_status()
        search_data = search_response.json()

    except requests.RequestException as e:
        print(f"Error during ISBN search: {e}")
        return {}

    # Check if any items were found
    if "items" not in search_data or len(search_data["items"]) == 0:
        return {}

    # Get the volume ID from the first result
    volume_id = search_data["items"][0]["id"]

    # Step 2: Get detailed information using the volume ID
    detail_url = f"{api_url}/{volume_id}"
    detail_params = {}

    # Only add API key if it's available
    if api_key:
        detail_params["key"] = api_key

    try:
        detail_response = requests.get(detail_url, params=detail_params)
        detail_response.raise_for_status()
        detail_data = detail_response.json()

    except requests.RequestException as e:
        print(f"Error fetching detailed volume info: {e}")
        return {}

    # Return the volumeInfo section which contains all the book details
    return detail_data.get("volumeInfo", {})
