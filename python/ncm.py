import sys
import os
from datetime import datetime

def create_directory(directory_name):
    # get current year
    # myyear = datetime.now().year
    # dir = r'//fs1/Quality - Records/8700 - Control of Nonconforming Product/' + str(myyear) + '/'
    os.makedirs(f'{directory_name}', exist_ok=True)
    print('Directory created successfully')

if __name__ == '__main__':
    directory_name = sys.argv[1]
    create_directory(directory_name)