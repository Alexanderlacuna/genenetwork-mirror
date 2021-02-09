import re
import requests
import urllib3

from urllib.request import urlopen as uReq
from bs4 import BeautifulSoup as soup
from urllib.parse import urljoin


def test_link(link):
    print(f"test for:{link}")
    results = None
    try:

        results = requests.get(link, verify=False, timeout=10)

    except Exception as e:
        print(f"failed for request {link}")
        # raise SystemExit(f"failed for request {link}")

    status_code = results.status_code if results is not None else "404"

    print(f'the link {link} ---> {status_code}')


def fetch_page_links(page_url):
    '''modified function to call internal links recursively '''

    visited = set()

    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
    html_page = uReq(page_url)
    parsed_page = soup(html_page, "html.parser")

    for link in parsed_page.findAll("a"):
        link_url = link.attrs.get("href")

        if re.match(r"^/", link_url):

            full_path = urljoin('http://localhost:5004/', link_url)
        elif re.match(r'^http://', link_url):
            full_path = link_url

        if link not in visited:
            visited.add(link)
            test_link(full_path)


def scraper_for_webpage(page_url):
    '''function for only links that starts with http '''
    html_page = uReq(page_url)
    parsed_page = soup(html_page, "html.parser")

    for link in parsed_page.findAll("a", attrs={"href": re.compile("^http://")}):
        test_link(link.get("href"))


fetch_page_links("http://localhost:5004/")
http
