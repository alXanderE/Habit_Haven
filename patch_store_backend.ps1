$path = 'C:\Habit Haven\src\app.js' 
$text = Get-Content -Path $path -Raw 
$insert = @' 
  app.post(\"/api/store/unequip\", async (req, res, next) => { 
    try { 
      const user = await getDemoUser(); 
      const { itemType } = req.body; 
 
      if (![\"avatar\", \"base\"].includes(itemType)) { 
        return res.status(400).json({ message: \"A valid item type is required.\" }); 
      } 
 
      if (itemType === \"avatar\") { 
        user.equippedAvatarItemId = null; 
      } else { 
        user.equippedBaseItemId = null; 
      } 
 
      await user.save(); 
      res.json({ message: \"Item unequipped.\", user }); 
    } catch (error) { 
      next(error); 
    } 
  }); 
 
'@ 
if ($text -notmatch '/api/store/unequip') { $text = $text -replace '  app.use\(\(err, _req, res, _next\) =\, ($insert + '  app.use((err, _req, res, _next) = } 
Set-Content -Path $path -Value $text 
