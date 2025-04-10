"""
Google Books API service module.
Provides functionality to fetch book data from Google Books API.
"""

import requests
from django.conf import settings


def fetch_book_data(isbn):
    """
    Fetch book data from Google Books API using a two-step process.

    First performs an ISBN search to get the volume ID, then makes a
    second request to get detailed information about the book.

    Args:
        isbn (str): The ISBN of the book to search for

    Returns:
        dict: Detailed book information from Google Books API or empty dict if not found
    """
    # Step 1: Search by ISBN to get the volume ID
    search_params = {
        "q": f"isbn:{isbn}",
        "key": settings.GOOGLE_BOOKS_API_KEY,
    }
    try:
        search_response = requests.get(
            settings.GOOGLE_BOOKS_API_URL, params=search_params
        )
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
    detail_url = f"{settings.GOOGLE_BOOKS_API_URL}/{volume_id}"
    detail_params = {"key": settings.GOOGLE_BOOKS_API_KEY}

    try:
        detail_response = requests.get(detail_url, params=detail_params)
        detail_response.raise_for_status()
        detail_data = detail_response.json()

    except requests.RequestException as e:
        print(f"Error fetching detailed volume info: {e}")
        return {}

    # Return the volumeInfo section which contains all the book details
    return detail_data.get("volumeInfo", {})
