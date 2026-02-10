import csv

# This creates a file with 10,000 rows + 1 header row
rows = 10000
filename = "test_data_10k.csv"

with open(filename, mode='w', newline='') as file:
    writer = csv.writer(file)
    # Header
    writer.writerow(["id", "name", "email", "amount", "status", "date"])
    
    # Data
    for i in range(1, rows + 1):
        writer.writerow([
            i, 
            f"User_{i}", 
            f"user{i}@example.com", 
            100 + i, 
            "active" if i % 2 == 0 else "pending", 
            "2026-02-10"
        ])

print(f"✅ Created {filename} with {rows} rows.")